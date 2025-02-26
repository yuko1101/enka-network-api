import { EnkaClient } from "../client/EnkaClient";
import { CharacterData } from "../models/character/CharacterData";

export function getCharactersById(id: number, enka: EnkaClient): CharacterData[] {
    const data = enka.cachedAssetsManager.getGenshinCacheData("AvatarExcelConfigData").findArray((_, p) => p.getAsNumber("id") === id)?.[1];
    if (!data) return [];
    if (data.has("candSkillDepotIds") && (data.get("candSkillDepotIds").mapArray((_, p) => p.getAsNumber())).length > 0) {
        return data.get("candSkillDepotIds").filterArray((_, skillDepotId) => hasEnergySkill(skillDepotId.getAsNumber(), enka)).map(([, skillDepotId]) => new CharacterData(data.getAsJsonObject(), enka, skillDepotId.getAsNumber()));
    }
    if (!hasEnergySkill(data.getAsNumber("skillDepotId"), enka)) return [];
    return [new CharacterData(data.getAsJsonObject(), enka)];
}

export function hasEnergySkill(skillDepotId: number, enka: EnkaClient): boolean {
    const data = enka.cachedAssetsManager.getGenshinCacheData("AvatarSkillDepotExcelConfigData").findArray((_, p) => p.getAsNumber("id") === skillDepotId)?.[1];
    if (!data) return false;
    return data.has("energySkill");
}

export function isReleased(characterId: number, enka: EnkaClient): boolean {
    const releaseData = enka.cachedAssetsManager.getGenshinCacheData("AvatarCodexExcelConfigData").findArray((_, p) => p.getAsNumber("avatarId") === characterId);
    return releaseData !== undefined || enka.cachedAssetsManager.getGenshinCacheData("AvatarHeroEntityExcelConfigData").mapArray((_, p) => p.getAsNumber("avatarId")).includes(characterId);
}

export function getNameIdByCharacterId(characterId: number, enka: EnkaClient): string {
    const data = enka.cachedAssetsManager.getGenshinCacheData("AvatarExcelConfigData").findArray((_, p) => p.getAsNumber("id") === characterId)?.[1];
    if (!data) throw new Error(`Character ID ${characterId} not found.`);
    return data.getAsString("iconName").slice("UI_AvatarIcon_".length);
}