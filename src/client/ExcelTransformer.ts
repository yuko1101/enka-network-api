import { FlexJsonArray, FlexJsonElement, FlexJsonObject, isFlexJsonObject, JsonOptions } from "config_file.js";

export const excelJsonOptions = {
    allowBigint: true,
} satisfies JsonOptions;

export type ExcelJsonElement = FlexJsonElement<typeof excelJsonOptions>;
export type ExcelJsonObject<T extends ExcelJsonElement = ExcelJsonElement> = FlexJsonObject<typeof excelJsonOptions, T>;
export type ExcelJsonArray<T extends ExcelJsonElement = ExcelJsonElement> = FlexJsonArray<typeof excelJsonOptions, T>;

export type ExcelKey = string | [string, ExcelJsonElement];

export const excelKeyMap = {
    "AvatarExcelConfigData": ["id"], // Characters
    "FetterInfoExcelConfigData": ["avatarId"], // Characters Profile Info
    "AvatarCostumeExcelConfigData": ["characterId", "skinId"], // Costumes
    "AvatarSkillDepotExcelConfigData": ["id"], // Skill Depot
    "AvatarSkillExcelConfigData": ["id"], // Skills
    "ProudSkillExcelConfigData": ["proudSkillGroupId", "level"], // Passive Talents and Leveled Talents
    "AvatarTalentExcelConfigData": ["talentId"], // Constellations
    "AvatarPromoteExcelConfigData": ["avatarPromoteId", ["promoteLevel", 0]], // Character Ascensions
    "AvatarCurveExcelConfigData": ["level"], // Character Basic Stats Curves
    "AvatarCodexExcelConfigData": ["avatarId"], // Character Release Information

    "WeaponExcelConfigData": ["id"], // Weapons
    "WeaponPromoteExcelConfigData": ["weaponPromoteId", ["promoteLevel", 0]], // Weapon Ascensions
    "WeaponCurveExcelConfigData": ["level"], // Weapon Basic Stats Curves
    "WeaponCodexExcelConfigData": ["weaponId"], // Weapon Release Information
    "EquipAffixExcelConfigData": ["id", ["level", 0]], // Artifact Set Bonus and Weapon Refinements
    "ReliquaryExcelConfigData": ["id"], // Artifacts
    "ReliquaryLevelExcelConfigData": [["rank", 0], "level"], // Artifact Main Affix
    "ReliquaryAffixExcelConfigData": ["id"], // Artifact Sub Affix
    "ReliquarySetExcelConfigData": ["setId"], // Artifact Sets
    "ReliquaryCodexExcelConfigData": ["suitId", "level"], // Artifact valid rarities

    "ManualTextMapConfigData": ["textMapId"], // Fight Props and Other TextMaps
    "AvatarHeroEntityExcelConfigData": ["avatarId"], // Travelers
    "TrialAvatarFetterDataConfigData": ["avatarId"], // Archons

    "MaterialExcelConfigData": ["id"], // Materials (including NameCards)
    "FetterCharacterCardExcelConfigData": ["avatarId"], // Friendship Rewards
    "RewardExcelConfigData": ["rewardId"], // Rewards Data for Friendship Cards

    "ProfilePictureExcelConfigData": ["id"], // User pfp

    "RoleCombatDifficultyExcelConfigData": ["difficultyId"], // Theater seasonal difficulty
} as const satisfies Record<string, ExcelKey[]>;

export type ExcelType = keyof typeof excelKeyMap;
export const excels = Object.keys(excelKeyMap) as ExcelType[];

export class ExcelTransformer {
    transform<T extends ExcelType>(excel: T, data: ExcelJsonObject[]): SingleBy<typeof excelKeyMap[T]> {
        return singleBy(data, ...excelKeyMap[excel]);
    }
}

export type IndexBy<T, Keys extends (string | number)[]> =
    Keys extends [string | number, ...infer U]
    ? U extends (string | number)[]
    ? T extends ExcelJsonObject<infer V>
    ? IndexBy<V, U> | undefined
    : unknown
    : T extends ExcelJsonObject<infer V>
    ? V | undefined
    : unknown
    : T;
export function indexBy<T extends ExcelJsonObject, U extends (string | number)[]>(data: T, ...keys: U): IndexBy<T, U> {
    if (keys.length === 0) return data as IndexBy<T, U>;
    const v = data[keys[0]];
    if (!isFlexJsonObject(excelJsonOptions, v)) return undefined as IndexBy<T, U>;
    return indexBy(v, ...keys.slice(1)) as IndexBy<T, U>;
}

export type SingleBy<Keys extends ExcelKey[]> = Keys extends [ExcelKey, ...infer T] ? T extends ExcelKey[] ? ExcelJsonObject<SingleBy<T>> : never : ExcelJsonObject;
export function singleBy<T extends ExcelKey[]>(array: ExcelJsonArray<ExcelJsonObject>, ...keys: T): SingleBy<T> {
    if (keys.length === 0) {
        if (array.length > 1) throw Error("Cannot have multiple elements");
        return array[0] as SingleBy<T>;
    }
    const grouped: ExcelJsonObject<ExcelJsonObject[]> = {};
    for (const e of array) {
        const key = Array.isArray(keys[0]) ? keys[0][0] : keys[0];
        if (!(key in e) && Array.isArray(keys[0])) e[key] = keys[0][1];
        const id = e[key]?.toString();
        if (!id) throw new Error("Some elements don't have specified keys");
        if (!(id in grouped)) grouped[id] = [];
        grouped[id].push(e);
    }

    const recursiveGrouped: ExcelJsonObject = {};
    for (const key in grouped) {
        const arr = grouped[key];
        recursiveGrouped[key] = singleBy(arr, ...keys.slice(1));
    }

    return recursiveGrouped as SingleBy<T>;
}