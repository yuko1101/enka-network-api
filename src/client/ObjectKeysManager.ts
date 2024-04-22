import { JsonReader } from "config_file.js";
import { CachedAssetsManager } from "./CachedAssetsManager";

export class ObjectKeysManager {
    /** Map key name where the value is arkhe of Fontaine characters in AvatarSkillDepotExcelConfigData.json */
    readonly characterArkheKey: string;
    /** Map key name where the value is the type of profile picture in ProfilePictureExcelConfigData.json */
    readonly profilePictureTypeKey: string;

    constructor(cachedAssetsManager: CachedAssetsManager) {
        const waterAetherSkillDepot = cachedAssetsManager.getGenshinCacheData("AvatarSkillDepotExcelConfigData").findArray((_, p) => p.getAsNumber("id") === 503)?.[1] as JsonReader;

        this.characterArkheKey = waterAetherSkillDepot.findObject((_, p) => p.getValue() === "Ousia")?.[0] as string;

        const aetherProfilePicture = cachedAssetsManager.getGenshinCacheData("ProfilePictureExcelConfigData").findArray((_, p) => p.getAsNumber("id") === 1)?.[1] as JsonReader;
        this.profilePictureTypeKey = aetherProfilePicture.findObject((_, p) => p.getValue() === "PROFILE_PICTURE_UNLOCK_BY_AVATAR")?.[0] as string;

        const invalidKeys = Object.entries(this).filter(entry => entry[1] === undefined).map(entry => entry[0]);
        if (invalidKeys.length > 0) throw new Error(`Invalid keys detected: ${invalidKeys.join(", ")}`);
    }
}
