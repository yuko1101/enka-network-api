import User from "../models/User";
import UserNotFoundError from "../errors/UserNotFoundError";
import { bindOptions, generateUuid } from "../utils/options_utils";
import * as characterUtils from "../utils/character_utils";
import CachedAssetsManager from "./CachedAssetsManager";
import CharacterData from "../models/character/CharacterData";
import WeaponData from "../models/weapon/WeaponData";
import Costume from "../models/character/Costume";
import { fetchJSON } from "../utils/axios_utils";
import NameCard from "../models/material/NameCard";
import EnkaNetworkError from "../errors/EnkaNetworkError";
import ArtifactData from "../models/artifact/ArtifactData";
import { artifactRarityRangeMap } from "../utils/constants";
import { separateByValue } from "../utils/object_utils";
import DetailedUser from "../models/DetailedUser";
import EnkaUser from "../models/enka/EnkaUser";
import EnkaProfile from "../models/enka/EnkaProfile";
import CharacterBuild from "../models/enka/CharacterBuild";
import Material from "../models/material/Material";
import InvalidUidFormatError from "../errors/InvalidUidFormatError";
import ArtifactSet from "../models/artifact/ArtifactSet";
import { LanguageCode } from "./CachedAssetsManager";
import { JsonElement } from "config_file.js";

const getUserUrl = (enkaUrl: string, uid: string | number) => `${enkaUrl}/api/uid/${uid}`;
const getEnkaProfileUrl = (enkaUrl: string, username: string) => `${enkaUrl}/api/profile/${username}`;

const userCacheMap = new Map();

/**
 * @en EnkaClientOptions
 * @typedef EnkaClientOptions
 * @type {object}
 * @property {string} [enkaUrl="https://enka.network"]
 * @property {string} [defaultImageBaseUrl="https://api.ambr.top/assets/UI"]
 * @property {Object<string, string>} [imageBaseUrlByPrefix]
 * @property {string} [userAgent="Mozilla/5.0"]
 * @property {bigint | number} [timeout=3000] http request timeout in milliseconds
 * @property {import("./CachedAssetsManager").LanguageCode} [defaultLanguage="en"]
 * @property {string} [cacheDirectory]
 * @property {boolean} [showFetchCacheLog=true]
 * @property {boolean} [storeUserCache=true]
 * @property {(key: string) => Promise<{ [s: string]: any }>} [userCacheGetter]
 * @property {(key: string, data: { [s: string]: any }) => Promise<void>} [userCacheSetter]
 * @property {(key: string) => Promise<void>} [userCacheDeleter]
 */
type EnkaClientOptions = {
    enkaUrl?: string,
    defaultImageBaseUrl?: string,
    imageBaseUrlByPrefix?: { [prefix: string]: string },
    userAgent?: string,
    timeout?: bigint | number,
    defaultLanguage?: LanguageCode,
    cacheDirectory?: string,
    showFetchCacheLog?: boolean,
    storeUserCache?: boolean,
    userCacheGetter?: (key: string) => Promise<{ [s: string]: JsonElement }>,
    userCacheSetter?: (key: string, data: { [s: string]: JsonElement }) => Promise<void>,
    userCacheDeleter?: (key: string) => Promise<void>,
}

/**
 * @en EnkaClient
 */
export default class EnkaClient {
    options: EnkaClientOptions;
    cachedAssetsManager: CachedAssetsManager;
    private _tasks: unknown[];

    /**
     * @param {EnkaClientOptions} [options]
     */
    constructor(options: EnkaClientOptions = {}) {
        /** @type {EnkaClientOptions} */
        this.options = bindOptions({
            "enkaUrl": "https://enka.network",
            "defaultImageBaseUrl": "https://api.ambr.top/assets/UI",
            "imageBaseUrlByPrefix": {
                "UI_Costume_": "https://enka.network/ui",
                "Eff_UI_Talent_": "https://res.cloudinary.com/genshin/image/upload/sprites",
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
        }, options);

        const userCacheFuncs = [this.options.userCacheGetter, this.options.userCacheSetter, this.options.userCacheDeleter];
        if (userCacheFuncs.some(f => f) && userCacheFuncs.some(f => !f)) throw new Error("All user cache functions (setter/getter/deleter) must be null or all must be customized.");

        this.cachedAssetsManager = new CachedAssetsManager(this);

        this._tasks = [];
    }

    /**
     * @param collapse Whether to fetch rough user information (Very fast)
     */
    async fetchUser(uid: number | string, collapse = false): Promise<User | DetailedUser> {
        if (isNaN(Number(uid))) throw new Error("Parameter `uid` must be a number or a string number.");

        const cacheGetter = this.options.userCacheGetter ?? (async (key) => userCacheMap.get(key));
        const cacheSetter = this.options.userCacheSetter ?? (async (key, data) => { userCacheMap.set(key, data); });
        const cacheDeleter = this.options.userCacheDeleter ?? (async (key) => { userCacheMap.delete(key); });

        const cacheKey = `${uid}${collapse ? "-info" : ""}`;
        const cachedUserData = (collapse ? await cacheGetter(cacheKey) : null) ?? await cacheGetter(uid.toString());

        const useCache = !!(cachedUserData && this.options.storeUserCache);

        let data: ;
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
                data["_lib"] = { cache_id: generateUuid(), created_at: Date.now(), expires_at: Date.now() + data.ttl * 1000, original_ttl: data.ttl };

                if (!collapse) await cacheDeleter(`${uid}-info`);
                await cacheSetter(cacheKey, data);
                const task = setTimeout(async () => {
                    const dataToDelete = await cacheGetter(cacheKey);
                    if (!dataToDelete) return;
                    if (dataToDelete._lib.cache_id === data._lib.cache_id) {
                        await cacheDeleter(cacheKey);
                    }
                    this._tasks.splice(this._tasks.indexOf(task), 1);
                }, data.ttl * 1000);
                this._tasks.push(task);
            }
        } else {
            // TODO: use structuredClone
            data = { ...cachedUserData };
            if (collapse) delete data["avatarInfoList"];
            data.ttl = Math.ceil((data._lib.expires_at - Date.now()) / 1000);
        }

        // console.log("useCache", useCache);
        const userData = bindOptions(data, { _lib: { is_cache: useCache } });

        return collapse ? new User(userData, this, uid) : new DetailedUser(userData, this, uid);
    }

    /**
     * @param {string} username enka.network username, not in-game nickname
     * @returns {Promise<EnkaProfile>}
     */
    async fetchEnkaProfile(username: string): Promise<EnkaProfile> {
        const url = getEnkaProfileUrl(this.options.enkaUrl, username);

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
     * @param {string} username enka.network username, not in-game nickname
     * @returns {Promise<Array<EnkaUser>>}
     */
    async fetchAllEnkaUsers(username: string): Promise<Array<EnkaUser>> {
        const url = `${getEnkaProfileUrl(this.options.enkaUrl, username)}/hoyos`;

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

        return Object.values(data).map(u => new EnkaUser(u, this, username));
    }

    /**
     * @param {string} username enka.network username, not in-game nickname
     * @param {string} hash EnkaUser hash
     * @returns {Promise<EnkaUser>}
     */
    async fetchEnkaUser(username: string, hash: string): Promise<EnkaUser> {
        const url = `${getEnkaProfileUrl(this.options.enkaUrl, username)}/hoyos/${hash}`;

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
     * @param {string} username enka.network username, not in-game nickname
     * @param {string} hash EnkaUser hash
     * @returns {Promise<Object<string, Array<CharacterBuild>>>}
     */
    async fetchEnkaUserBuilds(username: string, hash: string): Promise<{ [s: string]: Array<CharacterBuild>; }> {
        const url = `${getEnkaProfileUrl(this.options.enkaUrl, username)}/hoyos/${hash}/builds`;

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

        return Object.fromEntries(Object.entries(data).map(([charId, builds]) => [charId, builds.map(b => new CharacterBuild(b, this, username, hash))]));
    }

    /**
     * @param {boolean} [playableOnly=true]
     * @returns {Array<CharacterData>}
     */
    getAllCharacters(playableOnly: boolean = true): Array<CharacterData> {
        return this.cachedAssetsManager.getGenshinCacheData("AvatarExcelConfigData").map(c => characterUtils.getCharactersById(c.id, this)).map(chars => chars.filter(c => !playableOnly || (playableOnly && c.isPlayable))).reduce((a, b) => [...a, ...b]);
    }

    /**
     * @param {number | string} id characterId
     * @param {number | string} [skillDepotId] Mostly for Travelers.
     * @returns {CharacterData}
     */
    getCharacterById(id: number | string, skillDepotId: number | string): CharacterData {
        if (isNaN(id)) throw new Error("Parameter `id` must be a number or a string number.");
        return new CharacterData(Number(id), this, Number(skillDepotId));
    }

    /**
     * @param {boolean} [excludeInvalidWeapons]
     * @returns {Array<WeaponData>}
     */
    getAllWeapons(excludeInvalidWeapons: boolean = true): Array<WeaponData> {
        const weapons = this.cachedAssetsManager.getGenshinCacheData("WeaponExcelConfigData");
        if (excludeInvalidWeapons) {
            return weapons.filter(w => w.weaponPromoteId === w.id).map(w => new WeaponData(w.id, this, w));
        } else {
            return weapons.map(w => new WeaponData(w.id, this, w));
        }
    }

    /**
     * @param {number | string} id
     * @returns {WeaponData}
     */
    getWeaponById(id: number | string): WeaponData {
        if (isNaN(id)) throw new Error("Parameter `id` must be a number or a string number.");
        return new WeaponData(Number(id), this);
    }

    /**
     * @param {boolean} [includeDefaults] Whether to include default costumes
     * @returns {Array<Costume>}
     */
    getAllCostumes(includeDefaults: boolean = false): Array<Costume> {
        return this.cachedAssetsManager.getGenshinCacheData("AvatarCostumeExcelConfigData").filter(c => !includeDefaults || (includeDefaults && c.isDefault)).map(c => new Costume(null, this, c));
    }

    /**
     * @param {number | string} id
     * @returns {Costume}
     */
    getCostumeById(id: number | string): Costume {
        if (isNaN(id)) throw new Error("Parameter `id` must be a number or a string number.");
        return new Costume(Number(id), this);
    }

    /**
     * @returns {Array<Material>}
     */
    getAllMaterials(): Array<Material> {
        return this.cachedAssetsManager.getGenshinCacheData("MaterialExcelConfigData").map(m => Material.getMaterialById(m.id, this, m));
    }

    /**
     * @param {number | string} id
     * @returns {Material}
     */
    getMaterialById(id: number | string): Material {
        if (isNaN(id)) throw new Error("Parameter `id` must be a number or a string number.");
        return Material.getMaterialById(Number(id), this);
    }

    /**
     * @returns {Array<NameCard>}
     */
    getAllNameCards(): Array<NameCard> {
        return this.cachedAssetsManager.getGenshinCacheData("MaterialExcelConfigData").filter(m => m.materialType === NameCard.MATERIAL_TYPE).map(n => new NameCard(n.id, this, n));
    }

    /**
     * @param {number | string} id
     * @returns {NameCard}
     */
    getNameCardById(id: number | string): NameCard {
        if (isNaN(id)) throw new Error("Parameter `id` must be a number or a string number.");
        return new NameCard(Number(id), this);
    }

    /**
     * @param {boolean} [highestRarityOnly=false]
     * @returns {Array<ArtifactData>}
     */
    getAllArtifacts(highestRarityOnly: boolean = false): Array<ArtifactData> {
        const excludeSetIds = this.cachedAssetsManager.getGenshinCacheData("ReliquarySetExcelConfigData").filter(s => s.DisableFilter === 1).map(s => s.setId);

        // including artifacts with invalid rarity
        const artifacts = this.cachedAssetsManager.getGenshinCacheData("ReliquaryExcelConfigData").filter(a => a.setId && !excludeSetIds.includes(a.setId));

        const validRarityArtifacts = artifacts.filter(a => {
            const allowedRarityRange = artifactRarityRangeMap[a.setId] ?? [4, 5];
            const min = highestRarityOnly ? allowedRarityRange[1] : allowedRarityRange[0];
            const max = allowedRarityRange[1];
            const stars = a.rankLevel;
            return (min <= stars && stars <= max);
        });

        const chunked = separateByValue(validRarityArtifacts, (a) => `${a.setId}-${a.equipType}-${a.rankLevel}`);

        return Object.values(chunked).map(chunk => new ArtifactData(chunk[chunk.length - 1].id, this));
    }

    /**
     * @param {number | string} id
     * @returns {ArtifactData}
     */
    getArtifactById(id: number | string): ArtifactData {
        if (isNaN(id)) throw new Error("Parameter `id` must be a number or a string number.");
        return new ArtifactData(Number(id), this);
    }

    /**
     * @returns {Array<ArtifactSet>}
     */
    getAllArtifactSets(): Array<ArtifactSet> {
        const sets = this.cachedAssetsManager.getGenshinCacheData("ReliquarySetExcelConfigData").filter(s => s.DisableFilter !== 1);
        return sets.map(s => new ArtifactSet(s.setId, this, s));
    }

    /**
     * @param {number | string} id
     * @returns {ArtifactSet}
     */
    getArtifactSetById(id: number | string): ArtifactSet {
        if (isNaN(id)) throw new Error("Parameter `id` must be a number or a string number.");
        return new ArtifactSet(Number(id), this);
    }

    /**
     * Clear all running tasks in the client.
     * @returns {void}
     */
    close(): void {
        this._tasks.forEach(task => clearTimeout(task));
    }
}