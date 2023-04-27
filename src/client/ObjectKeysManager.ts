import { JsonObject } from "config_file.js";
import CachedAssetsManager from "./CachedAssetsManager";

/**
 * @en ObjectKeysManager
 */
class ObjectKeysManager {
    readonly costumeIdKey: string;
    readonly costumeCharacterIdKey: string;
    readonly costumeStarKey: string;
    readonly talentIsHiddenKey: string;

    constructor(cachedAssetsManager: CachedAssetsManager) {
        const costumeData = cachedAssetsManager.getGenshinCacheData("AvatarCostumeExcelConfigData");
        const jeanCostume = costumeData.find(c => c.jsonName === "Avatar_Lady_Sword_QinCostumeSea") as JsonObject;
        const dilucCostume = costumeData.find(c => c.jsonName === "Avatar_Male_Claymore_DilucCostumeFlamme") as JsonObject;

        this.costumeIdKey = Object.keys(jeanCostume).find(key => jeanCostume[key] === 200301) as string;
        this.costumeCharacterIdKey = Object.keys(jeanCostume).find(key => jeanCostume[key] === 10000003) as string;
        this.costumeStarKey = Object.keys(jeanCostume).find(key => jeanCostume[key] === 4 && dilucCostume[key] === 5) as string;

        const talentData = cachedAssetsManager.getGenshinCacheData("ProudSkillExcelConfigData");
        const raidenCannotCookTalent = talentData.find(talent => talent.proudSkillId === 522301) as JsonObject;

        const candidatesForTalentIsHiddenKey = Object.keys(raidenCannotCookTalent).filter(key => raidenCannotCookTalent[key] === true);
        if (candidatesForTalentIsHiddenKey.length > 1) {
            console.warn(`[ObjectKeysManager] Detected ${candidatesForTalentIsHiddenKey.length} keys for talentIsHiddenKey`);
        }

        this.talentIsHiddenKey = candidatesForTalentIsHiddenKey[0];

    }
}

export default ObjectKeysManager;