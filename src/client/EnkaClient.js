const User = require("../models/User");
const UserNotFoundError = require("../errors/UserNotFoundError");
const { bindOptions } = require("../utils/options_utils");
const characterUtils = require("../utils/character_utils");
const CachedAssetsManager = require("./CachedAssetsManager");
const CharacterData = require("../models/character/CharacterData");
const WeaponData = require("../models/weapon/WeaponData");
const Costume = require("../models/character/Costume");
const { fetchJSON } = require("../utils/axios_utils");
const NameCard = require("../models/NameCard");
// eslint-disable-next-line no-unused-vars
const { LanguageCode } = require("./CachedAssetsManager");
const EnkaNetworkError = require("../errors/EnkaNetworkError");

const getUserUrl = (uid) => `https://dev.enka.network/api/uid/${uid}`;

/**
 * @en EnkaClientOptions
 * @typedef EnkaClientOptions
 * @type {object}
 * @property {string} [userAgent="Mozilla/5.0"]
 * @property {int} [timeout=3000] http request timeout in milliseconds
 * @property {LanguageCode} [defaultLanguage="en"]
 * @property {string} [cacheDirectory]
 * @property {boolean} [showFetchCacheLog=true]
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
            "userAgent": "Mozilla/5.0",
            "timeout": 3000,
            "defaultLanguage": "en",
            "cacheDirectory": null,
            "showFetchCacheLog": true,
        }, options);

        /** @type {CachedAssetsManager} */
        this.cachedAssetsManager = new CachedAssetsManager(this);
    }

    /**
     * @param {number | string} uid
     * @param {boolean} collapse Whether to fetch rough user information (Very fast)
     * @param {boolean} parse
     * @returns {Promise<User>}
     */
    async fetchUser(uid, collapse = false, parse = true) {
        if (typeof uid !== "number" && typeof uid !== "string") throw new Error("Parameter `uid` must be a number or a string.");

        const url = getUserUrl(uid) + (collapse ? "?info" : "");

        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort("timeout"), this.options.timeout);

        const response = await fetchJSON(url, this, true);

        clearTimeout(timeoutId);

        if (response.status !== 200) {
            switch (response.status) {
                case 424:
                    throw new EnkaNetworkError("Request to enka.network failed because it is under maintenance.");
                case 429:
                    throw new EnkaNetworkError("Rate Limit reached. You reached enka.network's rate limit. Please try again in a few minutes.");
                case 500:
                    throw new UserNotFoundError(`User with uid ${uid} was not found. Please check whether the uid is correct. If you find the uid is correct, it may be a internal server error.`);
                default:
                    throw new EnkaNetworkError(`Request to enka.network failed with unknown status code ${response.status} - ${response.statusText}`);
            }
        }
        const data = response.data;
        return new User(data, this, parse, uid);
    }

    /**
     * @param {boolean} [playableOnly=true]
     * @returns {CharacterData[]}
     */
    getAllCharacters(playableOnly = true) {
        return this.cachedAssetsManager.getGenshinCacheData("AvatarExcelConfigData").map(c => characterUtils.getCharactersById(c.id, this)).map(chars => chars.filter(c => !playableOnly || (playableOnly && c.isPlayable))).reduce((a, b) => [...a, ...b]);
    }

    /**
     * @param {number} id characterId
     * @param {number} [skillDepotId] Mostly for Travelers.
     * @returns {CharacterData}
     */
    getCharacterById(id, skillDepotId) {
        return new CharacterData(id, this, skillDepotId);
    }

    /**
     * @param {boolean} [excludeInvalidWeapons]
     * @returns {WeaponData[]}
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
     * @param {number} id
     * @returns {WeaponData}
     */
    getWeaponById(id) {
        return new WeaponData(id, this);
    }

    /**
     * @param {boolean} [includeDefaults] Whether to include default costumes
     * @returns {Costume[]}
     */
    getAllCostumes(includeDefaults = false) {
        return this.cachedAssetsManager.getGenshinCacheData("AvatarCostumeExcelConfigData").filter(c => !includeDefaults || (includeDefaults && c.isDefault)).map(c => new Costume(null, this, c));
    }

    /**
     * @param {number} id
     * @returns {Costume}
     */
    getCostumeById(id) {
        return new Costume(id, this);
    }

    /**
     * @returns {NameCard[]}
     */
    getAllNameCards() {
        return this.cachedAssetsManager.getGenshinCacheData("MaterialExcelConfigData").filter(m => m.materialType === "MATERIAL_NAMECARD").map(n => new NameCard(n.id, this, n));
    }

    /**
     * @param {number} id
     * @returns {NameCard}
     */
    getNameCardById(id) {
        return new NameCard(id, this);
    }

}

module.exports = EnkaClient;
