/**
 * @en ObjectKeysManager
 */
class ObjectKeysManager {
    /** @param {CachedAssetsManager} cachedAssetsManager */
    constructor(cachedAssetsManager) {
        const costumeData = cachedAssetsManager.getGenshinCacheData("AvatarCostumeExcelConfigData");
        const jeanCostume = costumeData.find(c => c.jsonName === "Avatar_Lady_Sword_QinCostumeSea");
        const dilucCostume = costumeData.find(c => c.jsonName === "Avatar_Male_Claymore_DilucCostumeFlamme");

        this.costumeIdKey = Object.keys(jeanCostume).find(key => jeanCostume[key] === 200301);
        this.costumeCharacterIdKey = Object.keys(jeanCostume).find(key => jeanCostume[key] === 10000003);
        this.costumeStarKey = Object.keys(jeanCostume).find(key => jeanCostume[key] === 4 && dilucCostume[key] === 5);

    }
}

module.exports = ObjectKeysManager;