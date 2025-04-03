import { JsonOptions, JsonReader } from "config_file.js";
import { EnkaClient } from "../client/EnkaClient";
import { ExcelJsonObject, excelJsonOptions } from "../client/ExcelTransformer";
import { AssetsNotFoundError } from "../errors/AssetsNotFoundError";
import { percent } from "../utils/constants";
import { TextAssets } from "./assets/TextAssets";
import { nonNullable } from "../utils/ts_utils";

export class StatProperty<T extends FightProp = FightProp> {
    readonly fightProp: T;
    readonly enka: EnkaClient;
    readonly fightPropName: TextAssets;
    readonly isPercent: boolean;
    readonly rawValue: number;
    readonly value: number;

    readonly _propData: ExcelJsonObject;

    constructor(fightProp: T, value: number, enka: EnkaClient) {
        this.fightProp = fightProp;

        this.enka = enka;

        const propData = enka.cachedAssetsManager.getExcelData("ManualTextMapConfigData", fightProp);
        if (!propData) throw new AssetsNotFoundError("Fight Prop", fightProp);
        this._propData = propData;
        const propDataJson = new JsonReader(excelJsonOptions, this._propData);

        this.fightPropName = new TextAssets(propDataJson.getAsNumber("textMapContentTextMapHash"), enka);

        this.isPercent = percent.some(p => p === fightProp);

        this.rawValue = value;

        this.value = round(value, 8);
    }

    public get valueText(): string {
        const fix = this.isPercent ? 1 : 0;
        return this.getMultipliedValue().toFixed(fix).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (this.isPercent ? "%" : "");
    }

    /**
     * Multiplies [value](#value) by 100 if it is a percentage
     */
    getMultipliedValue(): number {
        return this.value * (this.isPercent ? 100 : 1);
    }

    toString(): string {
        const name = this.fightPropName.get() ?? "[Unknown]";
        return `${name}(${this.fightProp}): ${this.valueText}`;
    }

    static getFightPropTextAssets(fightProp: FightProp, enka: EnkaClient): TextAssets | null {
        const propData = enka.cachedAssetsManager.getExcelData("ManualTextMapConfigData", fightProp);
        return propData ? new TextAssets(new JsonReader(excelJsonOptions, propData).getAsNumber("textMapContentTextMapHash"), enka) : null;
    }

    static sumStatProperties(statProperties: StatProperty[], enka: EnkaClient): StatProperty[] {
        const stats: Record<string, number> = {};
        for (const prop of statProperties) {
            if (stats[prop.fightProp] === undefined) {
                stats[prop.fightProp] = 0;
            }
            stats[prop.fightProp] += prop.value;
        }

        return Object.entries(stats).map(([fightProp, value]) => new StatProperty(fightProp as FightProp, value, enka));
    }

    static parseAddProps<O extends JsonOptions>(json: JsonReader<O>, enka: EnkaClient): StatProperty[] {
        return json.filterArray((_, p) => p.has("propType") && p.has("value")).map(([, p]) => {
            const propType = p.getAsString("propType");
            if (propType === "FIGHT_PROP_NONE") return null;
            const value = p.getAsNumber("value");
            if (value === 0) return null;
            return new StatProperty(propType as FightProp, value, enka);
        }).filter(nonNullable);
    }
}


function round(x: number, decimalPlaces = 0) {
    const p = Math.pow(10, decimalPlaces);
    return Math.round(x * p) / p;
}

/**
 * Name|Description
 * ---|---
 * FIGHT_PROP_BASE_HP|Base HP
 * FIGHT_PROP_HP|Flat HP
 * FIGHT_PROP_HP_PERCENT|HP%
 * FIGHT_PROP_BASE_ATTACK|Base ATK
 * FIGHT_PROP_ATTACK|Flat ATK
 * FIGHT_PROP_ATTACK_PERCENT|ATK%
 * FIGHT_PROP_BASE_DEFENSE|Base DEF
 * FIGHT_PROP_DEFENSE|Flat DEF
 * FIGHT_PROP_DEFENSE_PERCENT|DEF%
 * FIGHT_PROP_BASE_SPEED|Base Speed
 * FIGHT_PROP_SPEED_PERCENT|Speed%
 * FIGHT_PROP_CRITICAL|Crit RATE
 * FIGHT_PROP_ANTI_CRITICAL|Anti Critical (Unknown)
 * FIGHT_PROP_CRITICAL_HURT|Crit DMG
 * FIGHT_PROP_ELEMENT_MASTERY|Elemental Mastery
 * FIGHT_PROP_CHARGE_EFFICIENCY|Energy Recharge
 * FIGHT_PROP_ADD_HURT|DMG Bonus
 * FIGHT_PROP_SUB_HURT|DMG Reduction
 * FIGHT_PROP_HEAL_ADD|Healing Bonus
 * FIGHT_PROP_HEALED_ADD|Incoming Healing Bonus
 * FIGHT_PROP_FIRE_ADD_HURT|Pyro DMG Bonus
 * FIGHT_PROP_FIRE_SUB_HURT|Pyro RES
 * FIGHT_PROP_WATER_ADD_HURT|Hydro DMG Bonus
 * FIGHT_PROP_WATER_SUB_HURT|Hydro RES
 * FIGHT_PROP_GRASS_ADD_HURT|Dendro DMG Bonus
 * FIGHT_PROP_GRASS_SUB_HURT|Dendro RES
 * FIGHT_PROP_ELEC_ADD_HURT|Electro DMG Bonus
 * FIGHT_PROP_ELEC_SUB_HURT|Electro RES
 * FIGHT_PROP_ICE_ADD_HURT|Cryo DMG Bonus
 * FIGHT_PROP_ICE_SUB_HURT|Cryo RES
 * FIGHT_PROP_WIND_ADD_HURT|Anemo DMG Bonus
 * FIGHT_PROP_WIND_SUB_HURT|Anemo RES
 * FIGHT_PROP_PHYSICAL_ADD_HURT|Physical DMG Bonus
 * FIGHT_PROP_PHYSICAL_SUB_HURT|Physical RES
 * FIGHT_PROP_ROCK_ADD_HURT|Geo DMG Bonus
 * FIGHT_PROP_ROCK_SUB_HURT|Geo RES
 * FIGHT_PROP_MAX_HP|Max HP
 * FIGHT_PROP_CUR_ATTACK|Current ATK
 * FIGHT_PROP_CUR_DEFENSE|Current DEF
 * FIGHT_PROP_CUR_SPEED|Current Speed
 * FIGHT_PROP_CUR_HP|Current HP
 * FIGHT_PROP_SKILL_CD_MINUS_RATIO|CD Reduction
 * FIGHT_PROP_SHIELD_COST_MINUS_RATIO|Shield Strength
 */
export type FightProp = "FIGHT_PROP_BASE_HP"
    | "FIGHT_PROP_HP"
    | "FIGHT_PROP_HP_PERCENT"
    | "FIGHT_PROP_BASE_ATTACK"
    | "FIGHT_PROP_ATTACK"
    | "FIGHT_PROP_ATTACK_PERCENT"
    | "FIGHT_PROP_BASE_DEFENSE"
    | "FIGHT_PROP_DEFENSE"
    | "FIGHT_PROP_DEFENSE_PERCENT"
    | "FIGHT_PROP_BASE_SPEED"
    | "FIGHT_PROP_SPEED_PERCENT"
    | "FIGHT_PROP_CRITICAL"
    | "FIGHT_PROP_ANTI_CRITICAL"
    | "FIGHT_PROP_CRITICAL_HURT"
    | "FIGHT_PROP_ELEMENT_MASTERY"
    | "FIGHT_PROP_CHARGE_EFFICIENCY"
    | "FIGHT_PROP_ADD_HURT"
    | "FIGHT_PROP_SUB_HURT"
    | "FIGHT_PROP_HEAL_ADD"
    | "FIGHT_PROP_HEALED_ADD"
    | "FIGHT_PROP_FIRE_ADD_HURT"
    | "FIGHT_PROP_FIRE_SUB_HURT"
    | "FIGHT_PROP_WATER_ADD_HURT"
    | "FIGHT_PROP_WATER_SUB_HURT"
    | "FIGHT_PROP_GRASS_ADD_HURT"
    | "FIGHT_PROP_GRASS_SUB_HURT"
    | "FIGHT_PROP_ELEC_ADD_HURT"
    | "FIGHT_PROP_ELEC_SUB_HURT"
    | "FIGHT_PROP_ICE_ADD_HURT"
    | "FIGHT_PROP_ICE_SUB_HURT"
    | "FIGHT_PROP_WIND_ADD_HURT"
    | "FIGHT_PROP_WIND_SUB_HURT"
    | "FIGHT_PROP_PHYSICAL_ADD_HURT"
    | "FIGHT_PROP_PHYSICAL_SUB_HURT"
    | "FIGHT_PROP_ROCK_ADD_HURT"
    | "FIGHT_PROP_ROCK_SUB_HURT"
    | "FIGHT_PROP_MAX_HP"
    | "FIGHT_PROP_CUR_ATTACK"
    | "FIGHT_PROP_CUR_DEFENSE"
    | "FIGHT_PROP_CUR_SPEED"
    | "FIGHT_PROP_CUR_HP"
    | "FIGHT_PROP_SKILL_CD_MINUS_RATIO"
    | "FIGHT_PROP_SHIELD_COST_MINUS_RATIO";