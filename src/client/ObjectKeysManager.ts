import { JsonObject } from "config_file.js";
import CachedAssetsManager from "./CachedAssetsManager";

/**
 * @en ObjectKeysManager
 */
class ObjectKeysManager {
    /** Map key name where the value is costume id in AvatarCostumeExcelConfigData.json */
    readonly costumeIdKey: string;
    /** Map key name where the value is character id in AvatarCostumeExcelConfigData.json */
    readonly costumeCharacterIdKey: string;
    /** Map key name where the value is stars of the costume in AvatarCostumeExcelConfigData.json */
    readonly costumeStarKey: string;
    /** Map key name where the value is whether the talent is hidden in ProudSkillExcelConfigData.json */
    readonly talentIsHiddenKey: string;

    /**
     * @param cachedAssetsManager
     */
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