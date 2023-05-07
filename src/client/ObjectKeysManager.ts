import { JsonReader } from "config_file.js";
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
        const jeanCostume = costumeData.findArray((_, p) => p.getAsString("jsonName") === "Avatar_Lady_Sword_QinCostumeSea")?.[1] as JsonReader;
        const dilucCostume = costumeData.findArray((_, p) => p.getAsString("jsonName") === "Avatar_Male_Claymore_DilucCostumeFlamme")?.[1] as JsonReader;

        this.costumeIdKey = jeanCostume.findObject((_, p) => p.getValue() === 200301)?.[0] as string;
        this.costumeCharacterIdKey = jeanCostume.findObject((_, p) => p.getValue() === 10000003)?.[0] as string;
        this.costumeStarKey = jeanCostume.findObject((key, p) => p.getValue() === 4 && dilucCostume.getValue(key) === 5)?.[0] as string;

        const talentData = cachedAssetsManager.getGenshinCacheData("ProudSkillExcelConfigData");
        const raidenCannotCookTalent = talentData.findArray((_, p) => p.getValue("proudSkillId") === 522301)?.[1] as JsonReader;

        const candidatesForTalentIsHiddenKey = raidenCannotCookTalent.filterObject((_, p) => p.getValue() === true);
        if (candidatesForTalentIsHiddenKey.length > 1) {
            console.warn(`[ObjectKeysManager] Detected ${candidatesForTalentIsHiddenKey.length} keys for talentIsHiddenKey`);
        }

        this.talentIsHiddenKey = candidatesForTalentIsHiddenKey[0]?.[0] as string;

        const invalidKeys = Object.entries(this).filter(entry => entry[1] === undefined).map(entry => entry[0]);
        if (invalidKeys.length > 0) throw new Error(`Invalid keys detected: ${invalidKeys.join(", ")}`);
    }
}

export default ObjectKeysManager;