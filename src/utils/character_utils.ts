import { JsonReader } from "config_file.js";
import { EnkaClient } from "../client/EnkaClient";
import { CharacterData } from "../models/character/CharacterData";
import { excelJsonOptions } from "../client/ExcelTransformer";
export function getCharactersById(id: number, enka: EnkaClient): CharacterData[] {
    const data = enka.cachedAssetsManager.getExcelData("AvatarExcelConfigData", id);
    if (!data) return [];
    const json = new JsonReader(excelJsonOptions, data);
    if (json.has("candSkillDepotIds") && (json.get("candSkillDepotIds").mapArray((_, p) => p.getAsNumber())).length > 0) {
        return json.get("candSkillDepotIds").filterArray((_, skillDepotId) => hasEnergySkill(skillDepotId.getAsNumber(), enka)).map(([, skillDepotId]) => new CharacterData(data, enka, skillDepotId.getAsNumber()));
    }
    if (!hasEnergySkill(json.getAsNumber("skillDepotId"), enka)) return [];
    return [new CharacterData(data, enka)];
}

export function hasEnergySkill(skillDepotId: number, enka: EnkaClient): boolean {
    const data = enka.cachedAssetsManager.getExcelData("AvatarSkillDepotExcelConfigData", skillDepotId);
    if (!data) return false;
    const json = new JsonReader(excelJsonOptions, data);
    return json.has("energySkill");
}

export function isReleased(characterId: number, enka: EnkaClient): boolean {
    const releaseData = enka.cachedAssetsManager.getExcelData("AvatarCodexExcelConfigData", characterId);
    return releaseData !== undefined || enka.cachedAssetsManager.getExcelData("AvatarHeroEntityExcelConfigData", characterId) !== undefined;
}

export function getNameIdByCharacterId(characterId: number, enka: EnkaClient): string {
    const data = enka.cachedAssetsManager.getExcelData("AvatarExcelConfigData", characterId);
    if (!data) throw new Error(`Character ID ${characterId} not found.`);
    const json = new JsonReader(excelJsonOptions, data);
    return json.getAsString("iconName").slice("UI_AvatarIcon_".length);
}