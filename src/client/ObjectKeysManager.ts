import { CachedAssetsManager } from "./CachedAssetsManager";

export class ObjectKeysManager {
    /** Map key name where the value is arkhe of Fontaine characters in AvatarSkillDepotExcelConfigData.json */
    readonly characterArkheKey: string;
    /** Map key name where the value is the type of profile picture in ProfilePictureExcelConfigData.json */
    readonly profilePictureTypeKey: string;
    /** Map key name where the value is the max charge of elemental bursts in AvatarSkillExcelConfigData.json (only for Mavuika at this moment) */
    readonly elementalBurstMaxChargeKey: string;
    /** Map key name where the value is the required charge for elemental bursts in AvatarSkillExcelConfigData.json (only for Mavuika at this moment) */
    readonly elementalBurstRequiredKey: string;

    constructor(cachedAssetsManager: CachedAssetsManager) {
        const waterAetherSkillDepot = cachedAssetsManager.getGenshinCacheData("AvatarSkillDepotExcelConfigData").findArray((_, p) => p.getAsNumber("id") === 503)?.[1];
        if (!waterAetherSkillDepot) throw new Error("Failed to find the water aether skill depot.");

        this.characterArkheKey = waterAetherSkillDepot.findObject((_, p) => p.getValue() === "Ousia")?.[0] as string;

        const aetherProfilePicture = cachedAssetsManager.getGenshinCacheData("ProfilePictureExcelConfigData").findArray((_, p) => p.getAsNumber("id") === 1)?.[1];
        if (!aetherProfilePicture) throw new Error("Failed to find the aether profile picture.");
        this.profilePictureTypeKey = aetherProfilePicture.findObject((_, p) => p.getValue() === "PROFILE_PICTURE_UNLOCK_BY_AVATAR")?.[0] as string;

        const mavuikaElementalBurst = cachedAssetsManager.getGenshinCacheData("AvatarSkillExcelConfigData").findArray((_, p) => p.getAsNumber("id") === 11065)?.[1];
        if (!mavuikaElementalBurst) throw new Error("Failed to find the mavuika elemental burst.");
        this.elementalBurstMaxChargeKey = mavuikaElementalBurst.findObject((_, p) => p.getValue() === 200)?.[0] as string;
        this.elementalBurstRequiredKey = mavuikaElementalBurst.findObject((_, p) => p.getValue() === 100)?.[0] as string;

        const invalidKeys = Object.entries(this).filter(entry => entry[1] === undefined).map(entry => entry[0]);
        if (invalidKeys.length > 0) throw new Error(`Invalid keys detected: ${invalidKeys.join(", ")}`);
    }
}
