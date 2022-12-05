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

const getUserUrl = (uid) => `https://enka.network/u/${uid}/__data.json`;

/** 
 * @en EnkaClient
 */
class EnkaClient {

    /**
     * @param {object} [options]
     * @param {string} [options.userAgent="Mozilla/5.0"]
     * @param {int} [options.timeout=3000] http request timeout in milliseconds
     * @param {"chs"|"cht"|"de"|"en"|"es"|"fr"|"id"|"jp"|"kr"|"pt"|"ru"|"th"|"vi"} [options.defaultLanguage="en"]
     * @param {string} [options.cacheDirectory]
     * @param {boolean} [options.showFetchCacheLog=true]
     */
    constructor(options) {
        /** @type {{userAgent: string, timeout: number, defaultLanguage: "chs"|"cht"|"de"|"en"|"es"|"fr"|"id"|"jp"|"kr"|"pt"|"ru"|"th"|"vi", cacheDirectory: string | null, showFetchCacheLog: boolean}} */
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
     * @param {number} uid
     * @param {boolean} parse
     * @returns {Promise<User>}
     */
    async fetchUser(uid, parse = true) {
        if (typeof uid !== "number") throw new Error("Parameter `uid` must be a number.");

        const url = getUserUrl(uid);

        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort("timeout"), this.options.timeout);

        const response = await fetchJSON(url, this, true);

        clearTimeout(timeoutId);

        if (response.status !== 200) {
            if (response.status === 429) throw new Error("Rate Limit reached. You reached enka.network's rate limit. Please try again in a few minutes.")
            if (response.status === 500) throw new UserNotFoundError(`User with uid ${uid} was not found. Please check whether the uid is correct. If you find the uid is correct, it may be a internal server error.`);
            throw new Error(`Request to enka.network failed with unknown status code ${response.status} - ${response.statusText}`);
        }
        const data = response.data;
        return new User(data, this, parse, uid);
    }

    /**
     * @param {boolean} [playableOnly=true]
     * @returns {CharacterData[]}
     */
    getAllCharacters(playableOnly = true) {
        return require(this.cachedAssetsManager.getJSONDataPath("AvatarExcelConfigData")).map(c => characterUtils.getCharactersById(c.id, this)).map(chars => chars.filter(c => !playableOnly || (playableOnly && c.isPlayable))).reduce((a, b) => [...a, ...b]);
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
        const weapons = require(this.cachedAssetsManager.getJSONDataPath("WeaponExcelConfigData"));
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
     * @param {boolean} includeDefaults Whether to include default costumes
     * @returns {Costume[]}
     */
    getAllCostumes(includeDefaults) {
        return require(this.cachedAssetsManager.getJSONDataPath("AvatarCostumeExcelConfigData")).filter(c => !includeDefaults || (includeDefaults && c.isDefault)).map(c => new Costume(c[Object.keys(c)[0]], this, c));
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
        return require(this.cachedAssetsManager.getJSONDataPath("MaterialExcelConfigData")).filter(m => m.materialType === "MATERIAL_NAMECARD").map(n => new NameCard(n.id, this, n));
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