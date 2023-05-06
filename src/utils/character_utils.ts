import { JsonManager } from "config_file.js";
import EnkaClient from "../client/EnkaClient";
import CharacterData from "../models/character/CharacterData";

/**
 * @param id
 * @param enka
 */
export function getCharactersById(id: number, enka: EnkaClient): CharacterData[] {
    const data = enka.cachedAssetsManager.getGenshinCacheData("AvatarExcelConfigData").find(p => p.getAsNumber("id") === id) as JsonManager;
    if (data.has("candSkillDepotIds") && (data.get("candSkillDepotIds").map(p => p.getAsNumber())).length > 0) {
        return data.get("candSkillDepotIds").filter(skillDepotId => hasEnergySkill(skillDepotId.getAsNumber(), enka)).map(skillDepotId => new CharacterData(id, enka, skillDepotId.getAsNumber()));
    } else {
        if (!hasEnergySkill(data.getAsNumber("skillDepotId"), enka)) return [];
        return [new CharacterData(id, enka)];
    }
}

/**
 * @param skillDepotId
 * @param enka
 */
export function hasEnergySkill(skillDepotId: number, enka: EnkaClient): boolean {
    const data = enka.cachedAssetsManager.getGenshinCacheData("AvatarSkillDepotExcelConfigData").find(p => p.getAsNumber("id") === skillDepotId) as JsonManager;
    return data.has("energySkill");
}

/**
 * @param characterId
 * @param enka
 */
export function isReleased(characterId: number, enka: EnkaClient): boolean {
    const releaseData = enka.cachedAssetsManager.getGenshinCacheData("AvatarCodexExcelConfigData").find(p => p.getAsNumber("avatarId") === characterId);
    return releaseData !== undefined || enka.cachedAssetsManager.getGenshinCacheData("AvatarHeroEntityExcelConfigData").map(p => p.getAsNumber("avatarId")).includes(characterId);
}

/**
 * @param characterId
 * @param enka
 */
export function getNameIdByCharacterId(characterId: number, enka: EnkaClient): string {
    const data = enka.cachedAssetsManager.getGenshinCacheData("AvatarExcelConfigData").find(p => p.getAsNumber("id") === characterId) as JsonManager;
    return data.getAsString("iconName").slice("UI_AvatarIcon_".length);
}