export = EnkaClient;
/**
 * @en EnkaClientOptions
 * @typedef EnkaClientOptions
 * @type {object}
 * @property {string} [enkaUrl="https://enka.network"]
 * @property {string} [imageBaseUrl="https://api.ambr.top/assets/UI"]
 * @property {string} [userAgent="Mozilla/5.0"]
 * @property {bigint} [timeout=3000] http request timeout in milliseconds
 * @property {import("./CachedAssetsManager").LanguageCode} [defaultLanguage="en"]
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
    constructor(options?: EnkaClientOptions | undefined);
    /** @type {EnkaClientOptions} */
    options: EnkaClientOptions;
    /** @type {CachedAssetsManager} */
    cachedAssetsManager: CachedAssetsManager;
    /**
     * @param {number | string} uid
     * @param {boolean} collapse Whether to fetch rough user information (Very fast)
     * @throws {EnkaNetworkError}
     * @returns {Promise<User | DetailedUser>}
     */
    fetchUser(uid: number | string, collapse?: boolean): Promise<User | DetailedUser>;
    /**
     * @param {string} username enka.network username, not in-game nickname
     * @returns {Promise<EnkaProfile>}
     */
    fetchEnkaProfile(username: string): Promise<EnkaProfile>;
    /**
     * @param {string} username enka.network username, not in-game nickname
     * @returns {Promise<Array<EnkaUser>>}
     */
    fetchAllEnkaUsers(username: string): Promise<Array<EnkaUser>>;
    /**
     * @param {string} username enka.network username, not in-game nickname
     * @param {string} hash EnkaUser hash
     * @returns {Promise<EnkaUser>}
     */
    fetchEnkaUser(username: string, hash: string): Promise<EnkaUser>;
    /**
     * @param {string} username enka.network username, not in-game nickname
     * @param {string} hash EnkaUser hash
     * @returns {Promise<Object<string, Array<CharacterBuild>>>}
     */
    fetchEnkaUserBuilds(username: string, hash: string): Promise<{
        [x: string]: Array<CharacterBuild>;
    }>;
    /**
     * @param {boolean} [playableOnly=true]
     * @returns {CharacterData[]}
     */
    getAllCharacters(playableOnly?: boolean | undefined): CharacterData[];
    /**
     * @param {number | string} id characterId
     * @param {number | string} [skillDepotId] Mostly for Travelers.
     * @returns {CharacterData}
     */
    getCharacterById(id: number | string, skillDepotId?: string | number | undefined): CharacterData;
    /**
     * @param {boolean} [excludeInvalidWeapons]
     * @returns {WeaponData[]}
     */
    getAllWeapons(excludeInvalidWeapons?: boolean | undefined): WeaponData[];
    /**
     * @param {number | string} id
     * @returns {WeaponData}
     */
    getWeaponById(id: number | string): WeaponData;
    /**
     * @param {boolean} [includeDefaults] Whether to include default costumes
     * @returns {Costume[]}
     */
    getAllCostumes(includeDefaults?: boolean | undefined): Costume[];
    /**
     * @param {number | string} id
     * @returns {Costume}
     */
    getCostumeById(id: number | string): Costume;
    /**
     * @returns {Material[]}
     */
    getAllMaterials(): Material[];
    /**
     * @param {number | string} id
     * @returns {Material}
     */
    getMaterialById(id: number | string): Material;
    /**
     * @returns {NameCard[]}
     */
    getAllNameCards(): NameCard[];
    /**
     * @param {number | string} id
     * @returns {NameCard}
     */
    getNameCardById(id: number | string): NameCard;
    /**
     * @param {boolean} [highestRarityOnly=false]
     * @returns {Array<ArtifactData>}
     */
    getAllArtifacts(highestRarityOnly?: boolean | undefined): Array<ArtifactData>;
    /**
     * @param {number | string} id
     * @returns {ArtifactData}
     */
    getArtifactById(id: number | string): ArtifactData;
}
declare namespace EnkaClient {
    export { EnkaClientOptions };
}
type EnkaClientOptions = {
    enkaUrl?: string | undefined;
    imageBaseUrl?: string | undefined;
    userAgent?: string | undefined;
    /**
     * http request timeout in milliseconds
     */
    timeout?: bigint | undefined;
    defaultLanguage?: CachedAssetsManager.LanguageCode | undefined;
    cacheDirectory?: string | undefined;
    showFetchCacheLog?: boolean | undefined;
};
import CachedAssetsManager = require("./CachedAssetsManager");
import User = require("../models/User");
import DetailedUser = require("../models/DetailedUser");
import EnkaProfile = require("../models/enka/EnkaProfile");
import EnkaUser = require("../models/enka/EnkaUser");
import CharacterBuild = require("../models/enka/CharacterBuild");
import CharacterData = require("../models/character/CharacterData");
import WeaponData = require("../models/weapon/WeaponData");
import Costume = require("../models/character/Costume");
import Material = require("../models/material/Material");
import NameCard = require("../models/material/NameCard");
import ArtifactData = require("../models/artifact/ArtifactData");
