import { PathResolver } from "config_file.js";
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
        const jeanCostume = costumeData.find(p => p.getAsString("jsonName") === "Avatar_Lady_Sword_QinCostumeSea") as PathResolver;
        const dilucCostume = costumeData.find(p => p.getAsString("jsonName") === "Avatar_Male_Claymore_DilucCostumeFlamme") as PathResolver;

        this.costumeIdKey = jeanCostume.find(p => p.getValue() === 200301)?.route.slice(-1)[0] as string;
        this.costumeCharacterIdKey = jeanCostume.find(p => p.getValue() === 10000003)?.route.slice(-1)[0] as string;
        this.costumeStarKey = jeanCostume.find(p => p.getValue() === 4 && dilucCostume.getValue(p?.route.slice(-1)[0] as string) === 5)?.route.slice(-1)[0] as string;

        const talentData = cachedAssetsManager.getGenshinCacheData("ProudSkillExcelConfigData");
        const raidenCannotCookTalent = talentData.find(p => p.getValue("proudSkillId") === 522301) as PathResolver;

        const candidatesForTalentIsHiddenKey = raidenCannotCookTalent.filter(p => p.getValue() === true);
        if (candidatesForTalentIsHiddenKey.length > 1) {
            console.warn(`[ObjectKeysManager] Detected ${candidatesForTalentIsHiddenKey.length} keys for talentIsHiddenKey`);
        }

        this.talentIsHiddenKey = candidatesForTalentIsHiddenKey[0]?.route.slice(-1)[0] as string;

        const invalidKeys = Object.entries(this).filter(entry => entry[1] === undefined).map(entry => entry[0]);
        if (invalidKeys.length > 0) throw new Error(`Invalid keys detected: ${invalidKeys.join(", ")}`);
    }
}

export default ObjectKeysManager;