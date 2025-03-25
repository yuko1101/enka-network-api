import { JsonReader } from "config_file.js";
import { EnkaClient } from "../../client/EnkaClient";
import { AssetsNotFoundError } from "../../errors/AssetsNotFoundError";
import { ImageAssets } from "../assets/ImageAssets";
import { TextAssets } from "../assets/TextAssets";
import { WeaponRefinement } from "./WeaponRefinement";
import { StatProperty, FightProp } from "../StatProperty";
import { WeaponAscension } from "./WeaponAscension";
import { nonNullable } from "../../utils/ts_utils";
import { ExcelJsonObject, excelJsonOptions } from "../../client/ExcelTransformer";

export type WeaponType = "WEAPON_SWORD_ONE_HAND" | "WEAPON_CLAYMORE" | "WEAPON_POLE" | "WEAPON_CATALYST" | "WEAPON_BOW";

export class WeaponData {
    readonly enka: EnkaClient;
    readonly id: number;
    readonly name: TextAssets;
    readonly description: TextAssets;
    readonly icon: ImageAssets;
    readonly awakenIcon: ImageAssets;
    readonly splashImage: ImageAssets;
    readonly stars: number;
    readonly weaponType: WeaponType;
    readonly weaponTypeName: TextAssets;
    readonly refinements: WeaponRefinement[];

    readonly _data: ExcelJsonObject;
    readonly _nameId: string;
    readonly _weaponTypeData: ExcelJsonObject;

    constructor(data: ExcelJsonObject, enka: EnkaClient) {
        this._data = data;
        this.enka = enka;

        const json = new JsonReader(excelJsonOptions, this._data);

        this.id = json.getAsNumber("id");

        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this._nameId = json.getAsString("icon").slice("UI_EquipIcon_".length);

        this.icon = new ImageAssets(json.getAsString("icon"), enka);

        this.awakenIcon = new ImageAssets(json.getAsString("awakenIcon"), enka);

        this.splashImage = new ImageAssets(`UI_Gacha_EquipIcon_${this._nameId}`, enka);

        this.stars = json.getAsNumber("rankLevel");

        this.weaponType = json.getAsString("weaponType") as WeaponType;

        const weaponTypeData = enka.cachedAssetsManager.getExcelData("ManualTextMapConfigData", this.weaponType);
        if (!weaponTypeData) throw new AssetsNotFoundError("Weapon Type", this.weaponType);
        this._weaponTypeData = weaponTypeData;

        this.weaponTypeName = new TextAssets(new JsonReader(excelJsonOptions, weaponTypeData).getAsNumber("textMapContentTextMapHash"), enka);

        this.refinements = (() => {
            const refinementId = json.getAsNumber("skillAffix", 0);
            if (refinementId === 0) return [];
            const refinementsData = enka.cachedAssetsManager.getExcelData("EquipAffixExcelConfigData", refinementId);
            if (!refinementsData) throw new AssetsNotFoundError("Weapon Refinements", refinementId);
            const refinementsJson = Object.entries(refinementsData).sort(([a], [b]) => Number(a) - Number(b));
            return refinementsJson.map(([, r]) => new WeaponRefinement(r, enka));
        })();
    }

    /**
     * @param ascension ascension level 0-6 for 3-5 stars, and 0-4 for 1-2 stars.
     */
    getAscensionData(ascension: number): WeaponAscension {
        return WeaponAscension.getById(new JsonReader(excelJsonOptions, this._data).getAsNumber("weaponPromoteId"), ascension, this.enka);
    }

    /**
     * @param ascension ascension level 0-6 for 3-5 stars, and 0-4 for 1-2 stars.
     * @param level weapon level 1-90 for 3-5 stars, and 1-70 for 1-2 stars.
     */
    getStats(ascension: number, level: number): StatProperty[] {
        const maxAscension = this.stars < 3 ? 4 : 6;
        const maxLevel = this.stars < 3 ? 70 : 90;
        if (ascension < 0 || maxAscension < ascension) throw new Error(`Ascension levels must be between 0 and ${maxAscension} for ${this.stars} stars.`);
        if (level < 1 || maxLevel < level) throw new Error(`Weapon levels must be between 1 and ${maxLevel} for ${this.stars} stars.`);
        const curveData = this.enka.cachedAssetsManager.getExcelData("WeaponCurveExcelConfigData", level);
        if (!curveData) throw new AssetsNotFoundError("Weapon Curve", level);
        const curve = new JsonReader(excelJsonOptions, curveData).get("curveInfos");
        const ascensionData = this.getAscensionData(ascension);

        const weaponJson = new JsonReader(excelJsonOptions, this._data);

        const weaponProps = weaponJson.get("weaponProp");

        const statPropertiesWithBaseValues = weaponProps.mapArray((_, prop) => {
            const fightProp = prop.getAsStringWithDefault(null, "propType") as FightProp | null;
            const baseValue = prop.getAsNumberWithDefault(null, "initValue");
            if (!fightProp || !baseValue) return null;
            const curveType = prop.getAsString("type");

            const targetCurve = curve.findArray((__, c) => c.getAsString("type") === curveType)?.[1];

            const ascensionValue = ascensionData.addProps.find(p => p.fightProp === fightProp)?.value ?? 0;

            const value = baseValue * (targetCurve ? targetCurve.getAsNumber("value") : 1) + ascensionValue;

            return new StatProperty(fightProp as FightProp, value, this.enka);

        }).filter(nonNullable);

        const usedFightProps = statPropertiesWithBaseValues.map(s => s.fightProp);
        const statPropertiesWithoutBaseValues = ascensionData.addProps.filter(p => !usedFightProps.includes(p.fightProp));

        return [...statPropertiesWithBaseValues, ...statPropertiesWithoutBaseValues];
    }

    static getById(id: number, enka: EnkaClient): WeaponData {
        const data = enka.cachedAssetsManager.getExcelData("WeaponExcelConfigData", id);
        if (!data) throw new AssetsNotFoundError("Weapon", id);
        return new WeaponData(data, enka);
    }
}
