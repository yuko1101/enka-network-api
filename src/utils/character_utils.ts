import { JsonReader } from "config_file.js";
import EnkaClient from "../client/EnkaClient";
import CharacterData from "../models/character/CharacterData";

/**
 * @param id
 * @param enka
 */
export function getCharactersById(id: number, enka: EnkaClient): CharacterData[] {
    const data = enka.cachedAssetsManager.getGenshinCacheData("AvatarExcelConfigData").findArray((_, p) => p.getAsNumber("id") === id)?.[1] as JsonReader;
    if (data.has("candSkillDepotIds") && (data.get("candSkillDepotIds").mapArray((_, p) => p.getAsNumber())).length > 0) {
        return data.get("candSkillDepotIds").filterArray((_, skillDepotId) => hasEnergySkill(skillDepotId.getAsNumber(), enka)).map(([, skillDepotId]) => new CharacterData(data.getAsJsonObject(), enka, skillDepotId.getAsNumber()));
    } else {
        if (!hasEnergySkill(data.getAsNumber("skillDepotId"), enka)) return [];
        return [new CharacterData(data.getAsJsonObject(), enka)];
    }
}

/**
 * @param skillDepotId
 * @param enka
 */
export function hasEnergySkill(skillDepotId: number, enka: EnkaClient): boolean {
    const data = enka.cachedAssetsManager.getGenshinCacheData("AvatarSkillDepotExcelConfigData").findArray((_, p) => p.getAsNumber("id") === skillDepotId)?.[1] as JsonReader;
    return data.has("energySkill");
}

/**
 * @param characterId
 * @param enka
 */
export function isReleased(characterId: number, enka: EnkaClient): boolean {
    const releaseData = enka.cachedAssetsManager.getGenshinCacheData("AvatarCodexExcelConfigData").findArray((_, p) => p.getAsNumber("avatarId") === characterId);
    return releaseData !== undefined || enka.cachedAssetsManager.getGenshinCacheData("AvatarHeroEntityExcelConfigData").mapArray((_, p) => p.getAsNumber("avatarId")).includes(characterId);
}

/**
 * @param characterId
 * @param enka
 */
export function getNameIdByCharacterId(characterId: number, enka: EnkaClient): string {
    const data = enka.cachedAssetsManager.getGenshinCacheData("AvatarExcelConfigData").findArray((_, p) => p.getAsNumber("id") === characterId)?.[1] as JsonReader;
    return data.getAsString("iconName").slice("UI_AvatarIcon_".length);
}