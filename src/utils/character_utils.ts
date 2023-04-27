import { JsonObject } from "config_file.js";
import EnkaClient from "../client/EnkaClient";
import CharacterData from "../models/character/CharacterData";

export function getCharactersById(id: number, enka: EnkaClient): CharacterData[] {
    const data = enka.cachedAssetsManager.getGenshinCacheData("AvatarExcelConfigData").find(c => c.id === id) as JsonObject;
    if (data.candSkillDepotIds && (data.candSkillDepotIds as number[]).length > 0) {
        return (data.candSkillDepotIds as number[]).filter(skillDepotId => hasEnergySkill(skillDepotId, enka)).map(skillDepotId => new CharacterData(id, enka, skillDepotId));
    } else {
        if (!hasEnergySkill(data.skillDepotId as number, enka)) return [];
        return [new CharacterData(id, enka)];
    }
}

export function hasEnergySkill(skillDepotId: number, enka: EnkaClient): boolean {
    const data = enka.cachedAssetsManager.getGenshinCacheData("AvatarSkillDepotExcelConfigData").find(s => s.id === skillDepotId) as JsonObject;
    return !!data.energySkill;
}

export function isReleased(characterId: number, enka: EnkaClient): boolean {
    const releaseData = enka.cachedAssetsManager.getGenshinCacheData("AvatarCodexExcelConfigData").find(r => r.avatarId === characterId) as JsonObject;
    return !!releaseData || enka.cachedAssetsManager.getGenshinCacheData("AvatarHeroEntityExcelConfigData").map(t => t.avatarId).includes(characterId);
}

export function getNameIdByCharacterId(characterId: number, enka: EnkaClient): string {
    const data = enka.cachedAssetsManager.getGenshinCacheData("AvatarExcelConfigData").find(c => c.id === characterId) as JsonObject;
    return (data.iconName as string).slice("UI_AvatarIcon_".length);
}