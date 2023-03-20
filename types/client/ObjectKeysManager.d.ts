export = ObjectKeysManager;
/**
 * @en ObjectKeysManager
 */
declare class ObjectKeysManager {
    /** @param {import("./CachedAssetsManager")} cachedAssetsManager */
    constructor(cachedAssetsManager: import("./CachedAssetsManager"));
    /** @type {string} */
    costumeIdKey: string;
    /** @type {string} */
    costumeCharacterIdKey: string;
    /** @type {string} */
    costumeStarKey: string;
    /** @type {string} */
    talentIsHiddenKey: string;
}
