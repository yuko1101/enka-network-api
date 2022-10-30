export = EnkaClient;
declare class EnkaClient {
    /**
     * @param {object} [options]
     * @param {string} [options.userAgent="Mozilla/5.0"]
     * @param {int} [options.timeout=3000] http request timeout in milliseconds
     * @param {"chs"|"cht"|"de"|"en"|"es"|"fr"|"id"|"jp"|"kr"|"pt"|"ru"|"th"|"vi"} [options.defaultLanguage="en"]
     */
    constructor(options?: {
        userAgent?: string;
        timeout?: int;
        defaultLanguage?: "chs" | "cht" | "de" | "en" | "es" | "fr" | "id" | "jp" | "kr" | "pt" | "ru" | "th" | "vi";
    });
    /** @type {{userAgent: string, timeout: number, defaultLanguage: "chs"|"cht"|"de"|"en"|"es"|"fr"|"id"|"jp"|"kr"|"pt"|"ru"|"th"|"vi"}} */
    options: {
        userAgent: string;
        timeout: number;
        defaultLanguage: "chs" | "cht" | "de" | "en" | "es" | "fr" | "id" | "jp" | "kr" | "pt" | "ru" | "th" | "vi";
    };
    /** @type {CachedAssetsManager} */
    cachedAssetsManager: CachedAssetsManager;
    /**
     * @param {number} uid
     * @param {boolean} parse
     * @returns {Promise<User>}
     */
    fetchUser(uid: number, parse?: boolean): Promise<User>;
    /**
     * @param {boolean} [playableOnly=true]
     * @returns {CharacterData[]}
     */
    getAllCharacters(playableOnly?: boolean): CharacterData[];
    /**
     * @param {number} id characterId
     * @param {number} [skillDepotId] Mostly for Travelers.
     * @returns {CharacterData[]}
     */
    getCharacterById(id: number, skillDepotId?: number): CharacterData[];
    /**
     * @returns {WeaponData[]}
     */
    getAllWeapons(): WeaponData[];
    /**
     * @param {number} id
     * @returns {WeaponData}
     */
    getWeaponById(id: number): WeaponData;
    /**
     * @param {boolean} includeDefaults Whether to include default costumes
     * @returns {Costume[]}
     */
    getAllCostumes(includeDefaults: boolean): Costume[];
    /**
     * @param {number} id
     * @returns {Costume}
     */
    getCostumeById(id: number): Costume;
}
import CachedAssetsManager = require("./CachedAssetsManager");
import User = require("../models/User");
import CharacterData = require("../models/character/CharacterData");
import WeaponData = require("../models/weapon/WeaponData");
import Costume = require("../models/character/Costume");
