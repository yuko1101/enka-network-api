const User = require("../models/User");
const UserNotFoundError = require("../errors/UserNotFoundError");
const { bindOptions } = require("../utils/options_utils");
const characterUtils = require("../utils/character_utils");

const fetch = require("node-fetch"); // for nodejs 16 or below
const CachedAssetsManager = require("./CachedAssetsManager");
const CharacterData = require("../models/character/CharacterData");
const WeaponData = require("../models/weapon/WeaponData");
const Costume = require("../models/character/Costume");

const getUserUrl = (uid) => `https://enka.network/u/${uid}/__data.json`;

module.exports = class EnkaClient {
    /**
     * @param {object} [options]
     * @param {string} [options.userAgent="Mozilla/5.0"]
     * @param {int} [options.timeout=3000] http request timeout in milliseconds
     * @param {"chs"|"cht"|"de"|"en"|"es"|"fr"|"id"|"jp"|"kr"|"pt"|"ru"|"th"|"vi"} [options.defaultLanguage="en"]
     */
    constructor(options) {
        /** @type {{userAgent: string, timeout: number, defaultLanguage: "chs"|"cht"|"de"|"en"|"es"|"fr"|"id"|"jp"|"kr"|"pt"|"ru"|"th"|"vi"}} */
        this.options = bindOptions({
            "userAgent": "Mozilla/5.0",
            "timeout": 3000,
            "defaultLanguage": "en",
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

        const response = await fetch(url, {
            headers: { "User-Agent": this.options.userAgent },
            signal: abortController.signal,
        });

        clearTimeout(timeoutId);

        if (response.status !== 200) {
            throw new UserNotFoundError(`User with uid ${uid} was not found.`);
        }
        const data = await response.json();
        return new User(data, parse, this);
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
     * @returns {CharacterData[]}
     */
    getCharacterById(id, skillDepotId) {
        return new CharacterData(id, this, skillDepotId);
    }

    /**
     * @returns {WeaponData[]}
     */
    getAllWeapons() {
        return require(this.cachedAssetsManager.getJSONDataPath("WeaponExcelConfigData")).map(w => new WeaponData(w.id, this));
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
        return require(this.cachedAssetsManager.getJSONDataPath("AvatarCostumeExcelConfigData")).filter(c => !includeDefaults || (includeDefaults && c.isDefault)).map(c => new Costume(c.OGKFGGNLLDG, this));
    }

    /**
     * @param {number} id
     * @returns {Costume}
     */
    getCostumeById(id) {
        return new Costume(id, this);
    }

}