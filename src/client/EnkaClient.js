const User = require("../models/User");
const UserNotFoundError = require("../errors/UserNotFoundError");
const { bindOptions, generateUuid } = require("../utils/options_utils");
const characterUtils = require("../utils/character_utils");
const CachedAssetsManager = require("./CachedAssetsManager");
const CharacterData = require("../models/character/CharacterData");
const WeaponData = require("../models/weapon/WeaponData");
const Costume = require("../models/character/Costume");
const { fetchJSON } = require("../utils/axios_utils");
const NameCard = require("../models/material/NameCard");
const EnkaNetworkError = require("../errors/EnkaNetworkError");
const ArtifactData = require("../models/artifact/ArtifactData");
const { artifactRarityRangeMap } = require("../utils/constants");
const { separateByValue } = require("../utils/object_utils");
const DetailedUser = require("../models/DetailedUser");
const EnkaUser = require("../models/enka/EnkaUser");
const EnkaProfile = require("../models/enka/EnkaProfile");
const CharacterBuild = require("../models/enka/CharacterBuild");
const Material = require("../models/material/Material");
const InvalidUidFormatError = require("../errors/InvalidUidFormatError");
const ArtifactSet = require("../models/artifact/ArtifactSet");

const getUserUrl = (enkaUrl, uid) => `${enkaUrl}/api/uid/${uid}`;
const getEnkaProfileUrl = (enkaUrl, username) => `${enkaUrl}/api/profile/${username}`;

const userCacheMap = new Map();

/**
 * @en EnkaClientOptions
 * @typedef EnkaClientOptions
 * @type {object}
 * @property {string} [enkaUrl="https://enka.network"]
 * @property {string} [defaultImageBaseUrl="https://api.ambr.top/assets/UI"]
 * @property {Object<string, string>} [imageBaseUrlByPrefix]
 * @property {string} [userAgent="Mozilla/5.0"]
 * @property {bigint} [timeout=3000] http request timeout in milliseconds
 * @property {import("./CachedAssetsManager").LanguageCode} [defaultLanguage="en"]
 * @property {string} [cacheDirectory]
 * @property {boolean} [showFetchCacheLog=true]
 * @property {boolean} [storeUserCache=true]
 */

/**
 * @en EnkaClient
 */
class EnkaClient {

    /**
     * @param {EnkaClientOptions} [options]
     */
    constructor(options = {}) {
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
        }, options);

        /** @type {CachedAssetsManager} */
        this.cachedAssetsManager = new CachedAssetsManager(this);

        /**
         * @private
         * @type {Array<*>}
         */
        this._tasks = [];
    }

    /**
     * @param {number | string} uid
     * @param {boolean} collapse Whether to fetch rough user information (Very fast)
     * @throws {EnkaNetworkError}
     * @returns {Promise<User | DetailedUser>}
     */
    async fetchUser(uid, collapse = false) {
        if (isNaN(uid)) throw new Error("Parameter `uid` must be a number or a string number.");

        const cacheKey = `${uid}${collapse ? "-info" : ""}`;
        const cachedUserData = userCacheMap.get(uid.toString()) ?? (collapse ? userCacheMap.get(cacheKey) : null);

        const useCache = !!(cachedUserData && this.options.storeUserCache);

        let data;
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
            data = { ...response.data };

            if (this.options.storeUserCache) {
                data["_lib"] = { cache_id: generateUuid(), created_at: Date.now(), expires_at: Date.now() + data.ttl * 1000, original_ttl: data.ttl };

                if (!collapse) userCacheMap.delete(`${uid}-info`);
                userCacheMap.set(cacheKey, data);
                const task = setTimeout(() => {
                    const dataToDelete = userCacheMap.get(cacheKey);
                    if (!dataToDelete) return;
                    if (dataToDelete._lib.cache_id === data._lib.cache_id) {
                        userCacheMap.delete(cacheKey);
                    }
                    this._tasks.splice(this._tasks.indexOf(task), 1);
                }, data.ttl * 1000);
                this._tasks.push(task);
            }
        } else {
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
    async fetchEnkaProfile(username) {
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
    async fetchAllEnkaUsers(username) {
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
    async fetchEnkaUser(username, hash) {
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
    async fetchEnkaUserBuilds(username, hash) {
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
    getAllCharacters(playableOnly = true) {
        return this.cachedAssetsManager.getGenshinCacheData("AvatarExcelConfigData").map(c => characterUtils.getCharactersById(c.id, this)).map(chars => chars.filter(c => !playableOnly || (playableOnly && c.isPlayable))).reduce((a, b) => [...a, ...b]);
    }

    /**
     * @param {number | string} id characterId
     * @param {number | string} [skillDepotId] Mostly for Travelers.
     * @returns {CharacterData}
     */
    getCharacterById(id, skillDepotId) {
        if (isNaN(id)) throw new Error("Parameter `id` must be a number or a string number.");
        return new CharacterData(Number(id), this, Number(skillDepotId));
    }

    /**
     * @param {boolean} [excludeInvalidWeapons]
     * @returns {Array<WeaponData>}
     */
    getAllWeapons(excludeInvalidWeapons = true) {
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
    getWeaponById(id) {
        if (isNaN(id)) throw new Error("Parameter `id` must be a number or a string number.");
        return new WeaponData(Number(id), this);
    }

    /**
     * @param {boolean} [includeDefaults] Whether to include default costumes
     * @returns {Array<Costume>}
     */
    getAllCostumes(includeDefaults = false) {
        return this.cachedAssetsManager.getGenshinCacheData("AvatarCostumeExcelConfigData").filter(c => !includeDefaults || (includeDefaults && c.isDefault)).map(c => new Costume(null, this, c));
    }

    /**
     * @param {number | string} id
     * @returns {Costume}
     */
    getCostumeById(id) {
        if (isNaN(id)) throw new Error("Parameter `id` must be a number or a string number.");
        return new Costume(Number(id), this);
    }

    /**
     * @returns {Array<Material>}
     */
    getAllMaterials() {
        return this.cachedAssetsManager.getGenshinCacheData("MaterialExcelConfigData").map(m => Material.getMaterialById(m.id, this, m));
    }

    /**
     * @param {number | string} id
     * @returns {Material}
     */
    getMaterialById(id) {
        if (isNaN(id)) throw new Error("Parameter `id` must be a number or a string number.");
        return Material.getMaterialById(Number(id), this);
    }

    /**
     * @returns {Array<NameCard>}
     */
    getAllNameCards() {
        return this.cachedAssetsManager.getGenshinCacheData("MaterialExcelConfigData").filter(m => m.materialType === NameCard.MATERIAL_TYPE).map(n => new NameCard(n.id, this, n));
    }

    /**
     * @param {number | string} id
     * @returns {NameCard}
     */
    getNameCardById(id) {
        if (isNaN(id)) throw new Error("Parameter `id` must be a number or a string number.");
        return new NameCard(Number(id), this);
    }

    /**
     * @param {boolean} [highestRarityOnly=false]
     * @returns {Array<ArtifactData>}
     */
    getAllArtifacts(highestRarityOnly = false) {
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
    getArtifactById(id) {
        if (isNaN(id)) throw new Error("Parameter `id` must be a number or a string number.");
        return new ArtifactData(Number(id), this);
    }

    /**
     * @returns {Array<ArtifactSet>}
     */
    getAllArtifactSets() {
        const sets = this.cachedAssetsManager.getGenshinCacheData("ReliquarySetExcelConfigData").filter(s => s.DisableFilter !== 1);
        return sets.map(s => new ArtifactSet(s.setId, this, s));
    }

    /**
     * @param {number | string} id
     * @returns {ArtifactSet}
     */
    getArtifactSetById(id) {
        if (isNaN(id)) throw new Error("Parameter `id` must be a number or a string number.");
        return new ArtifactSet(Number(id), this);
    }

    /**
     * Clear all running tasks in the client.
     * @returns {void}
     */
    close() {
        this._tasks.forEach(task => clearTimeout(task));
    }
}

module.exports = EnkaClient;
