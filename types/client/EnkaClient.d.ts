export = EnkaClient;
/**
 * @en EnkaClientOptions
 * @typedef EnkaClientOptions
 * @type {object}
 * @property {string} [enkaUrl="https://enka.network"]
 * @property {string} [userAgent="Mozilla/5.0"]
 * @property {bigint} [timeout=3000] http request timeout in milliseconds
 * @property {LanguageCode} [defaultLanguage="en"]
 * @property {string} [cacheDirectory]
 * @property {boolean} [showFetchCacheLog=true]
 */
/**
 * @en EnkaClient
 */
declare class EnkaClient {
    /**
     * @param {EnkaClientOptions} [options]
     */
    constructor(options?: EnkaClientOptions);
    /** @type {EnkaClientOptions} */
    options: EnkaClientOptions;
    /** @type {CachedAssetsManager} */
    cachedAssetsManager: CachedAssetsManager;
    /**
     * @param {number | string} uid
     * @param {boolean} collapse Whether to fetch rough user information (Very fast)
     * @param {boolean} parse
     * @returns {Promise<User>}
     */
    fetchUser(uid: number | string, collapse?: boolean, parse?: boolean): Promise<User>;
    /**
     * @param {boolean} [playableOnly=true]
     * @returns {CharacterData[]}
     */
    getAllCharacters(playableOnly?: boolean): CharacterData[];
    /**
     * @param {number} id characterId
     * @param {number} [skillDepotId] Mostly for Travelers.
     * @returns {CharacterData}
     */
    getCharacterById(id: number, skillDepotId?: number): CharacterData;
    /**
     * @param {boolean} [excludeInvalidWeapons]
     * @returns {WeaponData[]}
     */
    getAllWeapons(excludeInvalidWeapons?: boolean): WeaponData[];
    /**
     * @param {number} id
     * @returns {WeaponData}
     */
    getWeaponById(id: number): WeaponData;
    /**
     * @param {boolean} [includeDefaults] Whether to include default costumes
     * @returns {Costume[]}
     */
    getAllCostumes(includeDefaults?: boolean): Costume[];
    /**
     * @param {number} id
     * @returns {Costume}
     */
    getCostumeById(id: number): Costume;
    /**
     * @returns {NameCard[]}
     */
    getAllNameCards(): NameCard[];
    /**
     * @param {number} id
     * @returns {NameCard}
     */
    getNameCardById(id: number): NameCard;
    /**
     * @param {boolean} [highestRarityOnly=false]
     * @returns {Array<ArtifactData>}
     */
    getAllArtifacts(highestRarityOnly?: boolean): Array<ArtifactData>;
}
declare namespace EnkaClient {
    export { EnkaClientOptions };
}
type EnkaClientOptions = {
    enkaUrl?: string;
    userAgent?: string;
    /**
     * http request timeout in milliseconds
     */
    timeout?: bigint;
    defaultLanguage?: LanguageCode;
    cacheDirectory?: string;
    showFetchCacheLog?: boolean;
};
import CachedAssetsManager = require("./CachedAssetsManager");
import User = require("../models/User");
import CharacterData = require("../models/character/CharacterData");
import WeaponData = require("../models/weapon/WeaponData");
import Costume = require("../models/character/Costume");
import NameCard = require("../models/NameCard");
import ArtifactData = require("../models/artifact/ArtifactData");
import { LanguageCode } from "./CachedAssetsManager";
