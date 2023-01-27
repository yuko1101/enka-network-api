export = ObjectKeysManager;
/**
 * @en ObjectKeysManager
 */
declare class ObjectKeysManager {
    /** @param {CachedAssetsManager} cachedAssetsManager */
    constructor(cachedAssetsManager: CachedAssetsManager);
    /** @type {string} */
    costumeIdKey: string;
    /** @type {string} */
    costumeCharacterIdKey: string;
    /** @type {string} */
    costumeStarKey: string;
    /** @type {string} */
    talentIsHiddenKey: string;
}
import CachedAssetsManager = require("./CachedAssetsManager");
