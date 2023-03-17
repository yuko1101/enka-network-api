// eslint-disable-next-line no-unused-vars
const EnkaClient = require("../client/EnkaClient");
const AssetsNotFoundError = require("../errors/AssetsNotFoundError");
const { percent } = require("../utils/constants");
const TextAssets = require("./assets/TextAssets");

/**
 * @en StatusProperty
 */
class StatusProperty {

    /**
     * @param {FightProp} id
     * @param {number} value
     * @param {EnkaClient} enka
     */
    constructor(id, value, enka, multiplied = false) {
        /** @type {FightProp} */
        this.id = id;

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {Object<string, any>} */
        this._propData = enka.cachedAssetsManager.getGenshinCacheData("ManualTextMapConfigData").find(t => t.textMapId === id);
        if (!this._propData) throw new AssetsNotFoundError("Fight Prop", id);

        /** @type {TextAssets} */
        this.type = new TextAssets(this._propData.textMapContentTextMapHash, enka);

        /** @type {boolean} */
        this.isPercent = percent.includes(id);

        /** @type {number} */
        this.value = (multiplied && this.isPercent) ? value / 100 : value;
    }

    /**
     * Multiply `value` by 100 if it is a percentage.
     * @returns {number}
     */
    getFormattedValue() {
        return this.value * (this.isPercent ? 100 : 1);
    }

    /**
     * Returns simple value string.
     * @returns {string}
     */
    toString() {
        const fix = this.isPercent ? 1 : 0;
        return this.getFormattedValue().toFixed(fix).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (this.isPercent ? "%" : "");
    }
}

module.exports = StatusProperty;

/**
 * @en FightProp
 * @typedef FightProp
 * @type {"FIGHT_PROP_BASE_HP"|"FIGHT_PROP_HP"|"FIGHT_PROP_HP_PERCENT"|"FIGHT_PROP_BASE_ATTACK"|"FIGHT_PROP_ATTACK"|"FIGHT_PROP_ATTACK_PERCENT"|"FIGHT_PROP_BASE_DEFENSE"|"FIGHT_PROP_DEFENSE"|"FIGHT_PROP_DEFENSE_PERCENT"|"FIGHT_PROP_BASE_SPEED"|"FIGHT_PROP_SPEED_PERCENT"|"FIGHT_PROP_CRITICAL"|"FIGHT_PROP_ANTI_CRITICAL"|"FIGHT_PROP_CRITICAL_HURT"|"FIGHT_PROP_ELEMENT_MASTERY"|"FIGHT_PROP_CHARGE_EFFICIENCY"|"FIGHT_PROP_ADD_HURT"|"FIGHT_PROP_SUB_HURT"|"FIGHT_PROP_HEAL_ADD"|"FIGHT_PROP_HEALED_ADD"|"FIGHT_PROP_FIRE_ADD_HURT"|"FIGHT_PROP_FIRE_SUB_HURT"|"FIGHT_PROP_WATER_ADD_HURT"|"FIGHT_PROP_WATER_SUB_HURT"|"FIGHT_PROP_GRASS_ADD_HURT"|"FIGHT_PROP_GRASS_SUB_HURT"|"FIGHT_PROP_ELEC_ADD_HURT"|"FIGHT_PROP_ELEC_SUB_HURT"|"FIGHT_PROP_ICE_ADD_HURT"|"FIGHT_PROP_ICE_SUB_HURT"|"FIGHT_PROP_WIND_ADD_HURT"|"FIGHT_PROP_WIND_SUB_HURT"|"FIGHT_PROP_PHYSICAL_ADD_HURT"|"FIGHT_PROP_PHYSICAL_SUB_HURT"|"FIGHT_PROP_ROCK_ADD_HURT"|"FIGHT_PROP_ROCK_SUB_HURT"|"FIGHT_PROP_MAX_HP"|"FIGHT_PROP_CUR_ATTACK"|"FIGHT_PROP_CUR_DEFENSE"|"FIGHT_PROP_CUR_SPEED"|"FIGHT_PROP_CUR_HP"|"FIGHT_PROP_SKILL_CD_MINUS_RATIO"|"FIGHT_PROP_SHIELD_COST_MINUS_RATIO"}
 * @example
 * |Name|Description|
 * |---|---|
 * |FIGHT_PROP_BASE_HP|Base HP|
 * |FIGHT_PROP_HP|Flat HP|
 * |FIGHT_PROP_HP_PERCENT|HP%|
 * |FIGHT_PROP_BASE_ATTACK|Base ATK|
 * |FIGHT_PROP_ATTACK|Flat ATK|
 * |FIGHT_PROP_ATTACK_PERCENT|ATK%|
 * |FIGHT_PROP_BASE_DEFENSE|Base DEF|
 * |FIGHT_PROP_DEFENSE|Flat DEF|
 * |FIGHT_PROP_DEFENSE_PERCENT|DEF%|
 * |FIGHT_PROP_BASE_SPEED|Base Speed|
 * |FIGHT_PROP_SPEED_PERCENT|Speed%|
 * |FIGHT_PROP_CRITICAL|Crit RATE|
 * |FIGHT_PROP_ANTI_CRITICAL|Anti Critical (Unknown)|
 * |FIGHT_PROP_CRITICAL_HURT|Crit DMG|
 * |FIGHT_PROP_ELEMENT_MASTERY|Elemental Mastery|
 * |FIGHT_PROP_CHARGE_EFFICIENCY|Energy Recharge|
 * |FIGHT_PROP_ADD_HURT|DMG Bonus|
 * |FIGHT_PROP_SUB_HURT|DMG Reduction|
 * |FIGHT_PROP_HEAL_ADD|Healing Bonus|
 * |FIGHT_PROP_HEALED_ADD|Incoming Healing Bonus|
 * |FIGHT_PROP_FIRE_ADD_HURT|Pyro DMG Bonus|
 * |FIGHT_PROP_FIRE_SUB_HURT|Pyro RES|
 * |FIGHT_PROP_WATER_ADD_HURT|Hydro DMG Bonus|
 * |FIGHT_PROP_WATER_SUB_HURT|Hydro RES|
 * |FIGHT_PROP_GRASS_ADD_HURT|Dendro DMG Bonus|
 * |FIGHT_PROP_GRASS_SUB_HURT|Dendro RES|
 * |FIGHT_PROP_ELEC_ADD_HURT|Electro DMG Bonus|
 * |FIGHT_PROP_ELEC_SUB_HURT|Electro RES|
 * |FIGHT_PROP_ICE_ADD_HURT|Cryo DMG Bonus|
 * |FIGHT_PROP_ICE_SUB_HURT|Cryo RES|
 * |FIGHT_PROP_WIND_ADD_HURT|Anemo DMG Bonus|
 * |FIGHT_PROP_WIND_SUB_HURT|Anemo RES|
 * |FIGHT_PROP_PHYSICAL_ADD_HURT|Physical DMG Bonus|
 * |FIGHT_PROP_PHYSICAL_SUB_HURT|Physical RES|
 * |FIGHT_PROP_ROCK_ADD_HURT|Geo DMG Bonus|
 * |FIGHT_PROP_ROCK_SUB_HURT|Geo RES|
 * |FIGHT_PROP_MAX_HP|Max HP|
 * |FIGHT_PROP_CUR_ATTACK|Current ATK|
 * |FIGHT_PROP_CUR_DEFENSE|Current DEF|
 * |FIGHT_PROP_CUR_SPEED|Current Speed|
 * |FIGHT_PROP_CUR_HP|Current HP|
 * |FIGHT_PROP_SKILL_CD_MINUS_RATIO|CD Reduction|
 * |FIGHT_PROP_SHIELD_COST_MINUS_RATIO|Shield Strength|
 */