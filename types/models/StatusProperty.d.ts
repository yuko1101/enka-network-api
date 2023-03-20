export = StatusProperty;
/**
 * @en StatusProperty
 */
declare class StatusProperty {
    /**
     * @param {FightProp} id
     * @param {import("../client/EnkaClient")} enka
     * @returns {TextAssets | null}
     */
    static getFightPropTextAssets(id: FightProp, enka: import("../client/EnkaClient")): TextAssets | null;
    /**
     * @param {FightProp} id
     * @param {number} value
     * @param {import("../client/EnkaClient")} enka
     */
    constructor(id: FightProp, value: number, enka: import("../client/EnkaClient"), multiplied?: boolean);
    /** @type {FightProp} */
    id: FightProp;
    /** @type {import("../client/EnkaClient")} */
    enka: import("../client/EnkaClient");
    /** @type {Object<string, any>} */
    _propData: {
        [x: string]: any;
    };
    /** @type {TextAssets} */
    type: TextAssets;
    /** @type {boolean} */
    isPercent: boolean;
    /** @type {number} */
    value: number;
    /**
     * Multiply `value` by 100 if it is a percentage.
     * @returns {number}
     */
    getFormattedValue(): number;
    /**
     * Returns simple value string.
     * @returns {string}
     */
    toString(): string;
}
declare namespace StatusProperty {
    export { FightProp };
}
type FightProp = "FIGHT_PROP_BASE_HP" | "FIGHT_PROP_HP" | "FIGHT_PROP_HP_PERCENT" | "FIGHT_PROP_BASE_ATTACK" | "FIGHT_PROP_ATTACK" | "FIGHT_PROP_ATTACK_PERCENT" | "FIGHT_PROP_BASE_DEFENSE" | "FIGHT_PROP_DEFENSE" | "FIGHT_PROP_DEFENSE_PERCENT" | "FIGHT_PROP_BASE_SPEED" | "FIGHT_PROP_SPEED_PERCENT" | "FIGHT_PROP_CRITICAL" | "FIGHT_PROP_ANTI_CRITICAL" | "FIGHT_PROP_CRITICAL_HURT" | "FIGHT_PROP_ELEMENT_MASTERY" | "FIGHT_PROP_CHARGE_EFFICIENCY" | "FIGHT_PROP_ADD_HURT" | "FIGHT_PROP_SUB_HURT" | "FIGHT_PROP_HEAL_ADD" | "FIGHT_PROP_HEALED_ADD" | "FIGHT_PROP_FIRE_ADD_HURT" | "FIGHT_PROP_FIRE_SUB_HURT" | "FIGHT_PROP_WATER_ADD_HURT" | "FIGHT_PROP_WATER_SUB_HURT" | "FIGHT_PROP_GRASS_ADD_HURT" | "FIGHT_PROP_GRASS_SUB_HURT" | "FIGHT_PROP_ELEC_ADD_HURT" | "FIGHT_PROP_ELEC_SUB_HURT" | "FIGHT_PROP_ICE_ADD_HURT" | "FIGHT_PROP_ICE_SUB_HURT" | "FIGHT_PROP_WIND_ADD_HURT" | "FIGHT_PROP_WIND_SUB_HURT" | "FIGHT_PROP_PHYSICAL_ADD_HURT" | "FIGHT_PROP_PHYSICAL_SUB_HURT" | "FIGHT_PROP_ROCK_ADD_HURT" | "FIGHT_PROP_ROCK_SUB_HURT" | "FIGHT_PROP_MAX_HP" | "FIGHT_PROP_CUR_ATTACK" | "FIGHT_PROP_CUR_DEFENSE" | "FIGHT_PROP_CUR_SPEED" | "FIGHT_PROP_CUR_HP" | "FIGHT_PROP_SKILL_CD_MINUS_RATIO" | "FIGHT_PROP_SHIELD_COST_MINUS_RATIO";
import TextAssets = require("./assets/TextAssets");
