import { JsonReader } from "config_file.js";
import CachedAssetsManager from "./CachedAssetsManager";

/**
 * @en ObjectKeysManager
 */
class ObjectKeysManager {
    /** Map key name where the value is arkhe of Fontaine characters in AvatarSkillDepotExcelConfigData.json */
    readonly characterArkheKey: string;

    /**
     * @param cachedAssetsManager
     */
    constructor(cachedAssetsManager: CachedAssetsManager) {
        const waterAetherSkillDepot = cachedAssetsManager.getGenshinCacheData("AvatarSkillDepotExcelConfigData").findArray((_, p) => p.getAsNumber("id") === 503)?.[1] as JsonReader;

        this.characterArkheKey = waterAetherSkillDepot.findObject((_, p) => p.getValue() === "Ousia")?.[0] as string;

        const invalidKeys = Object.entries(this).filter(entry => entry[1] === undefined).map(entry => entry[0]);
        if (invalidKeys.length > 0) throw new Error(`Invalid keys detected: ${invalidKeys.join(", ")}`);
    }
}

export default ObjectKeysManager;