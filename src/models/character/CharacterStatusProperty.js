const EnkaClient = require("../../client/EnkaClient");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const TextAssets = require("../assets/TextAssets");

const percent = [
    "FIGHT_PROP_HP_PERCENT",
    "FIGHT_PROP_ATTACK_PERCENT",
    "FIGHT_PROP_DEFENSE_PERCENT",
    "FIGHT_PROP_SPEED_PERCENT",

    "FIGHT_PROP_CRITICAL",
    "FIGHT_PROP_CRITICAL_HURT",

    "FIGHT_PROP_CHARGE_EFFICIENCY",

    "FIGHT_PROP_HEAL_ADD",
    "FIGHT_PROP_HEALED_ADD",
    "FIGHT_PROP_PHYSICAL_SUB_HURT",
    "FIGHT_PROP_PHYSICAL_ADD_HURT",
    "FIGHT_PROP_FIRE_ADD_HURT",
    "FIGHT_PROP_ELEC_ADD_HURT",
    "FIGHT_PROP_WATER_ADD_HURT",
    "FIGHT_PROP_GRASS_ADD_HURT",
    "FIGHT_PROP_WIND_ADD_HURT",
    "FIGHT_PROP_ROCK_ADD_HURT",
    "FIGHT_PROP_ICE_ADD_HURT",
    "FIGHT_PROP_FIRE_SUB_HURT",
    "FIGHT_PROP_ELEC_SUB_HURT",
    "FIGHT_PROP_WATER_SUB_HURT",
    "FIGHT_PROP_GRASS_SUB_HURT",
    "FIGHT_PROP_WIND_SUB_HURT",
    "FIGHT_PROP_ROCK_SUB_HURT",
    "FIGHT_PROP_ICE_SUB_HURT",

    "FIGHT_PROP_SKILL_CD_MINUS_RATIO",
    "FIGHT_PROP_SHIELD_COST_MINUS_RATIO",
]

/** 
 * @en CharacterStatusProperty
 */
class CharacterStatusProperty {

    /** 
     * @param {string} id
     * @param {number} value
     * @param {EnkaClient} enka
     */
    constructor(id, value, enka) {
        /** @type {string} */
        this.id = id;

        /** @type {object} */
        this._propData = enka.cachedAssetsManager.getGenshinCacheData("ManualTextMapConfigData").find(t => t.textMapId === id);
        if (!this._propData) throw new AssetsNotFoundError("Fight Prop", id);

        /** @type {TextAssets} */
        this.type = new TextAssets(this._propData.textMapContentTextMapHash, enka);

        /** @type {boolean} */
        this.isPercent = percent.includes(id);

        /** @type {number} */
        this.value = value;
    }
}

module.exports = CharacterStatusProperty;