import User from "../models/User";
import UserNotFoundError from "../errors/UserNotFoundError";
import * as characterUtils from "../utils/character_utils";
import CachedAssetsManager from "./CachedAssetsManager";
import CharacterData from "../models/character/CharacterData";
import WeaponData from "../models/weapon/WeaponData";
import Costume from "../models/character/Costume";
import { fetchJSON } from "../utils/axios_utils";
import { NameCard } from "../models/material/Material";
import EnkaNetworkError from "../errors/EnkaNetworkError";
import ArtifactData from "../models/artifact/ArtifactData";
import { artifactRarityRangeMap } from "../utils/constants";
import DetailedUser from "../models/DetailedUser";
import EnkaUser from "../models/enka/EnkaUser";
import EnkaProfile from "../models/enka/EnkaProfile";
import CharacterBuild from "../models/enka/CharacterBuild";
import Material from "../models/material/Material";
import InvalidUidFormatError from "../errors/InvalidUidFormatError";
import ArtifactSet from "../models/artifact/ArtifactSet";
import { LanguageCode } from "./CachedAssetsManager";
import { JsonObject, bindOptions, generateUuid, separateByValue } from "config_file.js";

const getUserUrl = (enkaUrl: string, uid: string | number) => `${enkaUrl}/api/uid/${uid}`;
const getEnkaProfileUrl = (enkaUrl: string, username: string) => `${enkaUrl}/api/profile/${username}`;

const userCacheMap = new Map();

/**
 * @en EnkaClientOptions
 * @typedef
 */
export interface EnkaClientOptions {
    enkaUrl: string;
    defaultImageBaseUrl: string;
    imageBaseUrlByRegex: { [url: string]: RegExp[] };
    userAgent: string;
    timeout: number;
    defaultLanguage: LanguageCode;
    cacheDirectory: string | null;
    showFetchCacheLog: boolean;
    storeUserCache: boolean;
    userCacheGetter: ((key: string) => Promise<JsonObject>) | null;
    userCacheSetter: ((key: string, data: JsonObject) => Promise<void>) | null;
    userCacheDeleter: ((key: string) => Promise<void>) | null;
}

/**
 * @en EnkaClient
 */
class EnkaClient {
    /** The options the client was instantiated with */
    readonly options: EnkaClientOptions;
    /** The genshin cache data manager of the client */
    readonly cachedAssetsManager: CachedAssetsManager;

    private _tasks: NodeJS.Timeout[];

    /** @param options Options for the client */
    constructor(options: Partial<EnkaClientOptions> = {}) {
        this.options = bindOptions({
            "enkaUrl": "https://enka.network",
            "defaultImageBaseUrl": "https://api.ambr.top/assets/UI",
            "imageBaseUrlByRegex": {
                "https://enka.network/ui": [
                    /^UI_(Costume|NameCardIcon|NameCardPic|RelicIcon|AvatarIcon_Side)_/,
                    /^UI_AvatarIcon_(.+)_Card$/,
                    /^UI_EquipIcon_(.+)_Awaken$/,
                ],
                "https://res.cloudinary.com/genshin/image/upload/sprites": [/^Eff_UI_Talent_/],
            },
            "userAgent": "Mozilla/5.0",
            "timeout": 3000,
            "defaultLanguage": "en",
            "cacheDirectory": null,
            "showFetchCacheLog": true,
            "storeUserCache": true,
            "userCacheGetter": null,
            "userCacheSetter": null,
            "userCacheDeleter": null,
        }, options) as unknown as EnkaClientOptions;

        const userCacheFuncs = [this.options.userCacheGetter, this.options.userCacheSetter, this.options.userCacheDeleter];
        if (userCacheFuncs.some(f => f) && userCacheFuncs.some(f => !f)) throw new Error("All user cache functions (setter/getter/deleter) must be null or all must be customized.");

        this.cachedAssetsManager = new CachedAssetsManager(this);

        this._tasks = [];
    }

    /**
     * @param uid In-game UID of the user
     * @param collapse Whether to fetch rough user information (Very fast)
     * @returns DetailedUser if collapse is false, User if collapse is true
     */
    async fetchUser(uid: number | string, collapse = false): Promise<User | DetailedUser> {
        if (isNaN(Number(uid))) throw new Error("Parameter `uid` must be a number or a string number.");

        const cacheGetter = this.options.userCacheGetter ?? (async (key) => userCacheMap.get(key));
        const cacheSetter = this.options.userCacheSetter ?? (async (key, data) => { userCacheMap.set(key, data); });
        const cacheDeleter = this.options.userCacheDeleter ?? (async (key) => { userCacheMap.delete(key); });

        const cacheKey = `${uid}${collapse ? "-info" : ""}`;
        const cachedUserData = (collapse ? await cacheGetter(cacheKey) : null) ?? await cacheGetter(uid.toString());

        const useCache = !!(cachedUserData && this.options.storeUserCache);

        let data: JsonObject;
        if (!useCache) {
            const url = getUserUrl(this.options.enkaUrl, uid) + (collapse ? "?info" : "");

            const response = await fetchJSON(url, this, true);

            if (response.status !== 200) {
                switch (response.status) {
                    case 400:
                        throw new InvalidUidFormatError(`Invalid UID format. (${uid} provided.)`, response.status, response.statusText);
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

            if (this.options.storeUserCache) {
                data._lib = { cache_id: generateUuid(), created_at: Date.now(), expires_at: Date.now() + (data.ttl as number) * 1000, original_ttl: data.ttl };

                if (!collapse) await cacheDeleter(`${uid}-info`);
                await cacheSetter(cacheKey, data);
                const task = setTimeout(async () => {
                    const dataToDelete = await cacheGetter(cacheKey);
                    if (!dataToDelete) return;
                    if ((dataToDelete._lib as JsonObject).cache_id === (data._lib as JsonObject).cache_id) {
                        await cacheDeleter(cacheKey);
                    }
                    this._tasks.splice(this._tasks.indexOf(task), 1);
                }, data.ttl as number * 1000);
                this._tasks.push(task);
            }
        } else {
            // TODO: use structuredClone
            data = { ...cachedUserData };
            if (collapse) delete data["avatarInfoList"];
            data.ttl = Math.ceil(((data._lib as JsonObject).expires_at as number - Date.now()) / 1000);
        }

        // console.log("useCache", useCache);
        const userData = bindOptions(data, { _lib: { is_cache: useCache } }) as JsonObject;

        return collapse ? new User(userData, this) : new DetailedUser(userData, this);
    }

    /**
     * @param username enka.network username, not in-game nickname
     * @returns the Enka.Network account
    */
    async fetchEnkaProfile(username: string): Promise<EnkaProfile> {
        const url = getEnkaProfileUrl(this.options.enkaUrl as string, username);

        const response = await fetchJSON(url, this, true);

        if (response.status !== 200) {
            switch (response.status) {
                case 404:
                    throw new UserNotFoundError(`Enka.Network Profile with username ${username} was not found.`, response.status, response.statusText);
                default:
                    throw new EnkaNetworkError(`Request to enka.network failed with unknown status code ${response.status} - ${response.statusText}\nRequest url: ${url}`, response.status, response.statusText);
            }
        }
        const data = response.data;

        return new EnkaProfile(data, this);
    }

    /**
     * @param username enka.network username, not in-game nickname
     * @returns the all game accounts added to the Enka.Network account
     */
    async fetchAllEnkaUsers(username: string): Promise<EnkaUser[]> {
        const url = `${getEnkaProfileUrl(this.options.enkaUrl as string, username)}/hoyos`;

        const response = await fetchJSON(url, this, true);

        if (response.status !== 200) {
            switch (response.status) {
                case 404:
                    throw new UserNotFoundError(`Enka.Network Profile with username ${username} was not found.`, response.status, response.statusText);
                default:
                    throw new EnkaNetworkError(`Request to enka.network failed with unknown status code ${response.status} - ${response.statusText}\nRequest url: ${url}`, response.status, response.statusText);
            }
        }
        const data = response.data as { [hash: string]: JsonObject };

        return Object.values(data).map(u => new EnkaUser(u, this, username));
    }

    /**
     * @param username enka.network username, not in-game nickname
     * @param hash EnkaUser hash
     * @returns the game account added to the Enka.Network account
     */
    async fetchEnkaUser(username: string, hash: string): Promise<EnkaUser> {
        const url = `${getEnkaProfileUrl(this.options.enkaUrl as string, username)}/hoyos/${hash}`;

        const response = await fetchJSON(url, this, true);

        if (response.status !== 200) {
            switch (response.status) {
                case 404:
                    throw new UserNotFoundError(`Enka.Network Profile with username ${username} or EnkaUser with hash ${hash} was not found.`, response.status, response.statusText);
                default:
                    throw new EnkaNetworkError(`Request to enka.network failed with unknown status code ${response.status} - ${response.statusText}\nRequest url: ${url}`, response.status, response.statusText);
            }
        }
        const data = response.data;

        return new EnkaUser(data, this, username);
    }

    /**
     * @param username enka.network username, not in-game nickname
     * @param hash EnkaUser hash
     * @returns the character builds including saved builds in Enka.Network account
     */
    async fetchEnkaUserBuilds(username: string, hash: string): Promise<{ [characterId: string]: CharacterBuild[] }> {
        const url = `${getEnkaProfileUrl(this.options.enkaUrl as string, username)}/hoyos/${hash}/builds`;

        const response = await fetchJSON(url, this, true);

        if (response.status !== 200) {
            switch (response.status) {
                case 404:
                    throw new UserNotFoundError(`Enka.Network Profile with username ${username} or EnkaUser with hash ${hash} was not found.`, response.status, response.statusText);
                default:
                    throw new EnkaNetworkError(`Request to enka.network failed with unknown status code ${response.status} - ${response.statusText}\nRequest url: ${url}`, response.status, response.statusText);
            }
        }
        const data = response.data;

        return Object.fromEntries(Object.entries(data).map(([charId, builds]) => [charId, (builds as JsonObject[]).map(b => new CharacterBuild(b, this, username, hash))]));
    }

    /**
     * @returns all playable character data
     */
    getAllCharacters(): CharacterData[] {
        return this.cachedAssetsManager.getGenshinCacheData("AvatarExcelConfigData").filterArray((_, p) => p.has("useType") && p.getAsString("useType") === "AVATAR_FORMAL").map(([, p]) => characterUtils.getCharactersById(p.getAsNumber("id"), this)).reduce((a, b) => [...a, ...b], []);
    }

    /**
     * @param id The id of the character
     * @param skillDepotId Specifies one or zero elements for Traveler
     */
    getCharacterById(id: number | string, skillDepotId?: number | string): CharacterData {
        if (isNaN(Number(id))) throw new Error("Parameter `id` must be a number or a string number.");
        return new CharacterData(Number(id), this, skillDepotId ? Number(skillDepotId) : undefined);
    }

    /**
     * @param excludeInvalidWeapons
     * @returns all weapon data
     */
    getAllWeapons(excludeInvalidWeapons = true): WeaponData[] {
        const weapons = this.cachedAssetsManager.getGenshinCacheData("WeaponExcelConfigData");
        if (excludeInvalidWeapons) {
            return weapons.filterArray((_, p) => p.has("id") && p.has("weaponPromoteId") && p.getAsNumber("weaponPromoteId") === p.getAsNumber("id")).map(([, p]) => new WeaponData(p.getAsNumber("id"), this, p));
        } else {
            return weapons.mapArray((_, p) => new WeaponData(p.getAsNumber("id"), this, p));
        }
    }

    /**
     * @param id The id of the weapon
     */
    getWeaponById(id: number | string): WeaponData {
        if (isNaN(Number(id))) throw new Error("Parameter `id` must be a number or a string number.");
        return new WeaponData(Number(id), this);
    }

    /**
     * @param includeDefaults Whether to include default costumes
     * @returns all costume data
     */
    getAllCostumes(includeDefaults = false): Costume[] {
        return this.cachedAssetsManager.getGenshinCacheData("AvatarCostumeExcelConfigData").filterArray((_, p) => !includeDefaults || (includeDefaults && (p.has("isDefault") ? p.getAsBoolean("isDefault") : false))).map(([, p]) => new Costume(null, this, p));
    }

    /**
     * @param id The id of the costume
     */
    getCostumeById(id: number | string): Costume {
        if (isNaN(Number(id))) throw new Error("Parameter `id` must be a number or a string number.");
        return new Costume(Number(id), this);
    }

    /**
     * @returns all material data
     */
    getAllMaterials(): Material[] {
        return this.cachedAssetsManager.getGenshinCacheData("MaterialExcelConfigData").mapArray((_, p) => Material.getMaterialById(p.getAsNumber("id"), this, p));
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
        return this.cachedAssetsManager.getGenshinCacheData("MaterialExcelConfigData").filterArray((_, p) => p.has("materialType") && p.getAsString("materialType") === NameCard.MATERIAL_TYPE).map(([, p]) => new NameCard(p.getAsNumber("id"), this, p));
    }

    /**
     * @param id The id of the name card
     */
    getNameCardById(id: number | string): NameCard {
        if (isNaN(Number(id))) throw new Error("Parameter `id` must be a number or a string number.");
        return new NameCard(Number(id), this);
    }

    /**
     * @param highestRarityOnly Whether to return only the rarest of artifacts of the same type
     * @returns all artifact data
     */
    getAllArtifacts(highestRarityOnly = false): ArtifactData[] {
        const excludeSetIds = this.cachedAssetsManager.getGenshinCacheData("ReliquarySetExcelConfigData").filterArray((_, p) => p.getValue("DisableFilter") === 1).map(([, p]) => p.getAsNumber("setId"));

        // including artifacts with invalid rarity
        const artifacts = this.cachedAssetsManager.getGenshinCacheData("ReliquaryExcelConfigData").filterArray((_, p) => p.has("setId") && !excludeSetIds.includes(p.getAsNumber("setId")));

        const validRarityArtifacts = artifacts.filter(([, p]) => {
            const allowedRarityRange = artifactRarityRangeMap[p.getAsNumber("setId")] ?? [4, 5];
            const min = highestRarityOnly ? allowedRarityRange[1] : allowedRarityRange[0];
            const max = allowedRarityRange[1];
            const stars = p.getAsNumber("rankLevel");
            return (min <= stars && stars <= max);
        });

        const chunked = separateByValue(validRarityArtifacts, ([, p]) => `${p.getAsNumber("setId")}-${p.getAsString("equipType")}-${p.getAsNumber("rankLevel")}`);

        return Object.values(chunked).map(chunk => new ArtifactData(chunk[chunk.length - 1][1].getAsNumber("id"), this));
    }

    /**
     * @param id The id of the artifact
     */
    getArtifactById(id: number | string): ArtifactData {
        if (isNaN(Number(id))) throw new Error("Parameter `id` must be a number or a string number.");
        return new ArtifactData(Number(id), this);
    }

    /**
     * @returns all artifact set data
     */
    getAllArtifactSets(): ArtifactSet[] {
        const sets = this.cachedAssetsManager.getGenshinCacheData("ReliquarySetExcelConfigData").filterArray((_, p) => p.getValue("DisableFilter") !== 1);
        return sets.map(([, p]) => new ArtifactSet(p.getAsNumber("setId"), this, p));
    }

    /**
     * @param id The id of artifact set
     */
    getArtifactSetById(id: number | string): ArtifactSet {
        if (isNaN(Number(id))) throw new Error("Parameter `id` must be a number or a string number.");
        return new ArtifactSet(Number(id), this);
    }

    /**
     * Clear all running tasks in the client.
     */
    close(): void {
        this._tasks.forEach(task => clearTimeout(task));
    }
}

export default EnkaClient;