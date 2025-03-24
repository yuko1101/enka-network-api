import { GenshinUser } from "../models/GenshinUser";
import * as characterUtils from "../utils/character_utils";
import { CachedAssetsManager } from "./CachedAssetsManager";
import { CharacterData } from "../models/character/CharacterData";
import { WeaponData } from "../models/weapon/WeaponData";
import { Costume } from "../models/character/Costume";
import { fetchJSON } from "../utils/axios_utils";
import { NameCard } from "../models/material/Material";
import { ArtifactData } from "../models/artifact/ArtifactData";
import { DetailedGenshinUser } from "../models/DetailedGenshinUser";
import { EnkaGameAccount, EnkaNetworkError, EnkaSystem, EnkaLibrary, UserNotFoundError, InvalidUidFormatError } from "enka-system";
import { GenshinCharacterBuild } from "../models/enka/GenshinCharacterBuild";
import { Material } from "../models/material/Material";
import { ArtifactSet } from "../models/artifact/ArtifactSet";
import { LanguageCode } from "./CachedAssetsManager";
import { JsonObject, bindOptions, generateUuid, renameKeys } from "config_file.js";
import { DynamicData } from "../models/assets/DynamicTextAssets";
import { nonNullable, Overwrite } from "../utils/ts_utils";
import { CustomImageBaseUrl, ImageBaseUrl } from "../models/assets/ImageAssets";

const getUserUrl = (enkaUrl: string, uid: string | number) => `${enkaUrl}/api/uid/${uid}`;

const userCacheMap = new Map();

export const defaultImageBaseUrls: (ImageBaseUrl | CustomImageBaseUrl)[] = [
    {
        url: "https://homdgcat.wiki/homdgcat-res",
        priority: 12,
        format: "PNG",
        regexList: [
            /^UI_(RelicIcon|EquipIcon|ItemIcon)_/,
            /^UI_AvatarIcon_(?!Side_)(.+)(?<!_(Card|Circle))$/,
            /^Skill_/,
            /^UI_Gacha_AvatarImg_/,
            /^UI_NameCardPic_(.+)_P$/,
        ],
        customParser(fileName) {
            if (fileName.startsWith("UI_AvatarIcon_")) {
                return `Avatar/${fileName}.png`;
            } else if (fileName.startsWith("UI_RelicIcon_")) {
                return `Relic/${fileName}.png`;
            } else if (fileName.startsWith("UI_EquipIcon_")) {
                return `Weapon/${fileName}.png`;
            } else if (fileName.startsWith("UI_ItemIcon_")) {
                return `Mat/${fileName}.png`;
            } else if (fileName.startsWith("Skill_")) {
                return `AvatarSkill/${fileName}.png`;
            } else if (fileName.startsWith("UI_Gacha_AvatarImg_")) {
                return `Gacha/${fileName}.png`;
            } else if (fileName.startsWith("UI_NameCardPic_") && fileName.endsWith("_P")) {
                return `Avatar/${fileName}.png`;
            } else {
                throw new Error(`Unhandled file name: ${fileName}`);
            }
        },
    },
    {
        url: "https://enka.network/ui",
        priority: 10,
        format: "PNG",
        regexList: [
            /^UI_(Costume|NameCardIcon|NameCardPic|RelicIcon|AvatarIcon_Side|EquipIcon)_/,
            /^UI_AvatarIcon_(.+)_(Card|Circle)$/,
        ],
    },
    {
        url: "https://gi.yatta.moe/assets/UI",
        priority: 3,
        format: "PNG",
        regexList: [
            /.*/,
        ],
    },
    {
        url: "https://api.hakush.in/gi/UI",
        priority: 2,
        format: "WEBP",
        regexList: [
            /.*/,
        ],
    },
];

export interface UserCacheOptions {
    isEnabled: boolean;
    getter: ((key: string) => Promise<JsonObject>) | null;
    setter: ((key: string, data: JsonObject) => Promise<void>) | null;
    deleter: ((key: string) => Promise<void>) | null;
}

export interface EnkaClientOptions {
    enkaUrl: string;
    imageBaseUrls: ImageBaseUrl[];
    userAgent: string;
    requestTimeout: number;
    defaultLanguage: LanguageCode;
    textAssetsDynamicData: DynamicData;
    cacheDirectory: string | null;
    showFetchCacheLog: boolean;
    userCache: UserCacheOptions;
    /** For less rate limited cache update checking */
    githubToken: string | null;
    readonly enkaSystem: EnkaSystem;
}

export const defaultEnkaClientOptions: Overwrite<EnkaClientOptions, { "enkaSystem": EnkaSystem | null }> = {
    "enkaUrl": "https://enka.network",
    "imageBaseUrls": [...defaultImageBaseUrls],
    "userAgent": "Mozilla/5.0",
    "requestTimeout": 3000,
    "defaultLanguage": "en",
    "textAssetsDynamicData": {
        paramList: [],
        userInfo: null,
    },
    "cacheDirectory": null,
    "showFetchCacheLog": true,
    "userCache": {
        isEnabled: true,
        getter: null,
        setter: null,
        deleter: null,
    },
    "githubToken": null,
    "enkaSystem": null,
};

export class EnkaClient implements EnkaLibrary<GenshinUser, GenshinCharacterBuild> {
    readonly hoyoType: 0;
    getUser(data: JsonObject): GenshinUser {
        const fixedData = renameKeys(data, { "player_info": "playerInfo" });
        return new GenshinUser(fixedData, this);
    }
    getCharacterBuild(data: JsonObject, username: string, hash: string): GenshinCharacterBuild {
        return new GenshinCharacterBuild(data, this, username, hash);
    }


    /** The options the client was instantiated with */
    readonly options: EnkaClientOptions;
    /** The genshin cache data manager of the client */
    readonly cachedAssetsManager: CachedAssetsManager;

    private _tasks: NodeJS.Timeout[] = [];

    /** @param options Options for the client */
    constructor(options: Partial<EnkaClientOptions> = {}) {
        this.hoyoType = 0;
        const mergedOptions = bindOptions(defaultEnkaClientOptions, options);
        if (!mergedOptions.enkaSystem) {
            if (EnkaSystem.instance.getLibrary(this.hoyoType)) {
                mergedOptions.enkaSystem = new EnkaSystem();
            } else {
                mergedOptions.enkaSystem = EnkaSystem.instance;
            }
        }
        this.options = mergedOptions as unknown as EnkaClientOptions;

        const userCacheFuncs = [this.options.userCache.getter, this.options.userCache.setter, this.options.userCache.deleter];
        if (userCacheFuncs.some(f => f) && userCacheFuncs.some(f => !f)) throw new Error("All user cache functions (setter/getter/deleter) must be null or all must be customized.");

        this.cachedAssetsManager = new CachedAssetsManager(this);

        this.options.enkaSystem.registerLibrary(this);
    }


    /**
     * @param uid In-game UID of the user
     * @param collapse Whether to fetch rough user information (Very fast)
     * @returns DetailedGenshinUser if collapse is false, GenshinUser if collapse is true
     * @throws {EnkaNetworkError}
     */
    async _fetchUser<T extends boolean>(uid: number | string, collapse: T): Promise<T extends true ? GenshinUser : DetailedGenshinUser> {
        if (isNaN(Number(uid))) throw new Error("Parameter `uid` must be a number or a string number.");

        const cacheGetter = this.options.userCache.getter ?? (async (key) => userCacheMap.get(key));
        const cacheSetter = this.options.userCache.setter ?? (async (key, data) => { userCacheMap.set(key, data); });
        const cacheDeleter = this.options.userCache.deleter ?? (async (key) => { userCacheMap.delete(key); });

        const cacheKey = `${uid}${collapse ? "-info" : ""}`;
        const cachedUserData = (collapse ? await cacheGetter(cacheKey) : null) ?? await cacheGetter(uid.toString());

        const useCache = !!(cachedUserData && this.options.userCache.isEnabled);

        let data: JsonObject;
        if (!useCache) {
            const url = getUserUrl(this.options.enkaUrl, uid) + (collapse ? "?info" : "");

            const response = await fetchJSON(url, this, true);

            if (response.status !== 200) {
                switch (response.status) {
                    case 400:
                        throw new InvalidUidFormatError(Number(uid), response.status, response.statusText);
                    case 424:
                        throw new EnkaNetworkError("Request to enka.network failed because it is under maintenance.", response.status, response.statusText);
                    case 429:
                        throw new EnkaNetworkError("Rate Limit reached. You reached enka.network's rate limit. Please try again in a few minutes.", response.status, response.statusText);
                    case 404:
                        throw new UserNotFoundError(`User with uid ${uid} was not found. Please check whether the uid is correct. If you find the uid is correct, it may be a internal server error.`, response.status, response.statusText);
                    default:
                        throw new EnkaNetworkError(`Request to enka.network failed with unknown status code ${response.status} - ${response.statusText}\nRequest url: ${url}`, response.status, response.statusText);
                }
            }
            // TODO: use structuredClone
            data = { ...response.data };

            if (this.options.userCache.isEnabled) {
                const lifetime = data.ttl as number * 1000;
                const now = Date.now();

                data._lib = { cache_id: generateUuid(), created_at: now, expires_at: now + lifetime, original_ttl: data.ttl };
                const task = setTimeout(async () => {
                    const dataToDelete = await cacheGetter(cacheKey);
                    if (!dataToDelete) return;
                    if ((dataToDelete._lib as JsonObject).cache_id === (data._lib as JsonObject).cache_id) {
                        await cacheDeleter(cacheKey);
                    }
                    this._tasks.splice(this._tasks.indexOf(task), 1);
                }, lifetime);
                this._tasks.push(task);

                if (!collapse) await cacheDeleter(`${uid}-info`);
                await cacheSetter(cacheKey, data);
            }
        } else {
            // TODO: use structuredClone
            data = { ...cachedUserData };
            if (collapse) delete data["avatarInfoList"];
            data.ttl = Math.ceil(((data._lib as JsonObject).expires_at as number - Date.now()) / 1000);
        }

        // console.log("useCache", useCache);
        const userData = bindOptions(data, { _lib: { is_cache: useCache } }) as JsonObject;

        const user = collapse ? new GenshinUser(userData, this) : new DetailedGenshinUser(userData, this);
        return user as T extends true ? GenshinUser : DetailedGenshinUser;
    }

    /**
     * @param uid In-game UID of the user
     */
    async fetchUser(uid: number | string): Promise<DetailedGenshinUser> {
        return await this._fetchUser(uid, false);
    }

    /**
     * @param uid In-game UID of the user
     */
    async fetchCollapsedUser(uid: number | string): Promise<GenshinUser> {
        return await this._fetchUser(uid, true);
    }

    /**
     * @param username enka.network username, not in-game nickname
     * @returns the genshin accounts added to the Enka.Network account
     */
    async fetchEnkaGenshinAccounts(username: string): Promise<EnkaGameAccount<EnkaClient>[]> {
        return await this.options.enkaSystem.fetchEnkaGameAccounts(username, [0]) as EnkaGameAccount<EnkaClient>[];
    }

    /**
     * @param username enka.network username, not in-game nickname
     * @param hash EnkaGameAccount hash
     * @returns the genshin account with provided hash
     */
    async fetchEnkaGenshinAccount(username: string, hash: string): Promise<EnkaGameAccount<EnkaClient>> {
        return await this.options.enkaSystem.fetchEnkaGameAccount(username, hash);
    }

    /**
     * @param username enka.network username, not in-game nickname
     * @param hash EnkaGameAccount hash
     * @returns the genshin character builds including saved builds in Enka.Network account
     */
    async fetchEnkaGenshinBuilds(username: string, hash: string): Promise<{ [characterId: string]: GenshinCharacterBuild[] }> {
        return await this.options.enkaSystem.fetchEnkaCharacterBuilds<EnkaClient>(username, hash);
    }

    /**
     * @returns all playable character data
     */
    getAllCharacters(): CharacterData[] {
        return this.cachedAssetsManager.getGenshinCacheData("AvatarExcelConfigData").filterArray((_, p) => p.getAsStringWithDefault(null, "useType") === "AVATAR_FORMAL" && p.getAsNumber("featureTagGroupID") === p.getAsNumber("id")).map(([, p]) => characterUtils.getCharactersById(p.getAsNumber("id"), this)).reduce((a, b) => [...a, ...b], []);
    }

    /**
     * @param id The id of the character
     * @param skillDepotId Specifies one or zero elements for Traveler
     */
    getCharacterById(id: number | string, skillDepotId?: number | string): CharacterData {
        if (isNaN(Number(id))) throw new Error("Parameter `id` must be a number or a string number.");
        return CharacterData.getById(Number(id), this, skillDepotId ? Number(skillDepotId) : undefined);
    }

    /**
     * @returns all weapon data
     */
    getAllWeapons(excludeInvalidWeapons = true, filterByCodex = true): WeaponData[] {
        const weapons = this.cachedAssetsManager.getGenshinCacheData("WeaponExcelConfigData");
        const weaponDataList = excludeInvalidWeapons
            ? weapons.filterArray((_, p) => p.has("id") && p.has("weaponPromoteId") && p.getAsNumber("weaponPromoteId") === p.getAsNumber("id")).map(([, p]) => new WeaponData(p.getAsJsonObject(), this))
            : weapons.mapArray((_, p) => new WeaponData(p.getAsJsonObject(), this));

        if (filterByCodex) {
            const codexSet = new Set(this.cachedAssetsManager.getGenshinCacheData("WeaponCodexExcelConfigData").mapArray((_, p) => p.getAsNumber("weaponId")));
            return weaponDataList.filter(w => codexSet.has(w.id));
        } else {
            return weaponDataList;
        }
    }

    /**
     * @param id The id of the weapon
     */
    getWeaponById(id: number | string): WeaponData {
        if (isNaN(Number(id))) throw new Error("Parameter `id` must be a number or a string number.");
        return WeaponData.getById(Number(id), this);
    }

    /**
     * @param includeDefaults Whether to include default costumes
     * @returns all costume data
     */
    getAllCostumes(includeDefaults = false): Costume[] {
        return this.cachedAssetsManager.getGenshinCacheData("AvatarCostumeExcelConfigData").filterArray((_, p) => !includeDefaults || (includeDefaults && p.getAsBooleanWithDefault(false, "isDefault"))).map(([, p]) => new Costume(p.getAsJsonObject(), this));
    }

    /**
     * @param id The id of the costume
     */
    getCostumeById(id: number | string): Costume {
        if (isNaN(Number(id))) throw new Error("Parameter `id` must be a number or a string number.");
        return Costume.getById(Number(id), this);
    }

    /**
     * @returns all material data
     */
    getAllMaterials(): Material[] {
        return this.cachedAssetsManager.getGenshinCacheData("MaterialExcelConfigData").mapArray((_, p) => Material.getMaterialByData(p.getAsJsonObject(), this));
    }

    /**
     * @param id The id of the material
     */
    getMaterialById(id: number | string): Material {
        if (isNaN(Number(id))) throw new Error("Parameter `id` must be a number or a string number.");
        return Material.getMaterialById(Number(id), this);
    }

    /**
     * @returns all name card data
     */
    getAllNameCards(): NameCard[] {
        return this.cachedAssetsManager.getGenshinCacheData("MaterialExcelConfigData").filterArray((_, p) => p.has("materialType") && p.getAsString("materialType") === NameCard.MATERIAL_TYPE).map(([, p]) => new NameCard(p.getAsJsonObject(), this));
    }

    /**
     * @param id The id of the name card
     */
    getNameCardById(id: number | string): NameCard {
        if (isNaN(Number(id))) throw new Error("Parameter `id` must be a number or a string number.");
        const material = Material.getMaterialById(Number(id), this);
        if (material.materialType !== NameCard.MATERIAL_TYPE) throw new Error(`Material ${material.id} is not a NameCard.`);
        return material as NameCard;
    }

    /**
     * @param highestRarityOnly Whether to return only the rarest of artifacts of the same type
     * @returns all artifact data
     */
    getAllArtifacts(highestRarityOnly = false): ArtifactData[] {
        const allArtifacts = Object.fromEntries(this.cachedAssetsManager.getGenshinCacheData("ReliquaryExcelConfigData").mapArray((_, p) => [p.getAsNumber("id"), p.getAsJsonObject()]));
        const artifacts: ArtifactData[] = [];

        const validRarityMap: Record<number, number[]> = {};
        if (highestRarityOnly) {
            this.cachedAssetsManager.getGenshinCacheData("ReliquaryCodexExcelConfigData").forEachArray((_, c) => {
                const setId = c.getAsNumber("suitId");
                const stars = c.getAsNumber("level");
                if (highestRarityOnly) {
                    if (validRarityMap[setId]) {
                        if (validRarityMap[setId][0] < stars) validRarityMap[setId][0] = stars;
                    } else {
                        validRarityMap[setId] = [stars];
                    }
                } else {
                    if (!(setId in validRarityMap)) validRarityMap[setId] = [];
                    validRarityMap[setId].push(stars);
                }
            });
        }

        this.cachedAssetsManager.getGenshinCacheData("ReliquaryCodexExcelConfigData").forEachArray((_, c) => {
            if (highestRarityOnly) {
                const setId = c.getAsNumber("suitId");
                const stars = c.getAsNumber("level");
                if (!validRarityMap[setId].includes(stars)) return;
            }

            const ids = [
                c.getAsNumberWithDefault(null, "cupId"),
                c.getAsNumberWithDefault(null, "leatherId"),
                c.getAsNumberWithDefault(null, "capId"),
                c.getAsNumberWithDefault(null, "flowerId"),
                c.getAsNumberWithDefault(null, "sandId"),
            ].filter(nonNullable);

            artifacts.push(...ids.map(id => new ArtifactData(allArtifacts[id], this)));
        });

        return artifacts;
    }

    /**
     * @param id The id of the artifact
     */
    getArtifactById(id: number | string): ArtifactData {
        if (isNaN(Number(id))) throw new Error("Parameter `id` must be a number or a string number.");
        return ArtifactData.getById(Number(id), this);
    }

    /**
     * @returns all artifact set data
     */
    getAllArtifactSets(): ArtifactSet[] {
        const sets = this.cachedAssetsManager.getGenshinCacheData("ReliquarySetExcelConfigData").filterArray((_, p) => p.getValue("disableFilter") !== 1);
        return sets.map(([, p]) => new ArtifactSet(p.getAsJsonObject(), this));
    }

    /**
     * @param id The id of artifact set
     */
    getArtifactSetById(id: number | string): ArtifactSet {
        if (isNaN(Number(id))) throw new Error("Parameter `id` must be a number or a string number.");
        return ArtifactSet.getById(Number(id), this);
    }

    /**
     * Clear all running tasks in the client.
     */
    close(): void {
        this._tasks.forEach(task => clearTimeout(task));
    }
}
