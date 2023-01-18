// eslint-disable-next-line no-unused-vars
const EnkaClient = require("../../client/EnkaClient");
// eslint-disable-next-line no-unused-vars
const Element = require("../Element");
const StatusProperty = require("../StatusProperty");

const fightProps = {
    1: "FIGHT_PROP_BASE_HP",
    2: "FIGHT_PROP_HP",
    3: "FIGHT_PROP_HP_PERCENT",
    4: "FIGHT_PROP_BASE_ATTACK",
    5: "FIGHT_PROP_ATTACK",
    6: "FIGHT_PROP_ATTACK_PERCENT",
    7: "FIGHT_PROP_BASE_DEFENSE",
    8: "FIGHT_PROP_DEFENSE",
    9: "FIGHT_PROP_DEFENSE_PERCENT",
    10: "FIGHT_PROP_BASE_SPEED",
    11: "FIGHT_PROP_SPEED_PERCENT",
    20: "FIGHT_PROP_CRITICAL",
    22: "FIGHT_PROP_CRITICAL_HURT",
    23: "FIGHT_PROP_CHARGE_EFFICIENCY",
    26: "FIGHT_PROP_HEAL_ADD",
    27: "FIGHT_PROP_HEALED_ADD",
    28: "FIGHT_PROP_ELEMENT_MASTERY",
    29: "FIGHT_PROP_PHYSICAL_SUB_HURT",
    30: "FIGHT_PROP_PHYSICAL_ADD_HURT",
    40: "FIGHT_PROP_FIRE_ADD_HURT",
    41: "FIGHT_PROP_ELEC_ADD_HURT",
    42: "FIGHT_PROP_WATER_ADD_HURT",
    43: "FIGHT_PROP_GRASS_ADD_HURT",
    44: "FIGHT_PROP_WIND_ADD_HURT",
    45: "FIGHT_PROP_ROCK_ADD_HURT",
    46: "FIGHT_PROP_ICE_ADD_HURT",
    50: "FIGHT_PROP_FIRE_SUB_HURT",
    51: "FIGHT_PROP_ELEC_SUB_HURT",
    52: "FIGHT_PROP_WATER_SUB_HURT",
    53: "FIGHT_PROP_GRASS_SUB_HURT",
    54: "FIGHT_PROP_WIND_SUB_HURT",
    55: "FIGHT_PROP_ROCK_SUB_HURT",
    56: "FIGHT_PROP_ICE_SUB_HURT",
    70: "", // Pyro Energy Cost
    71: "", // Electro Energy Cost
    72: "", // Hydro Energy Cost
    73: "", // Dendro Energy Cost
    74: "", // Anemo Energy Cost
    75: "", // Cryo Energy Cost
    76: "", // Geo Energy Cost
    80: "FIGHT_PROP_SKILL_CD_MINUS_RATIO",
    81: "FIGHT_PROP_SHIELD_COST_MINUS_RATIO",
    1000: "", // Current Pyro Energy
    1001: "", // Current Electro Energy
    1002: "", // Current Hydro Energy
    1003: "", // Current Dendro Energy
    1004: "", // Current Anemo Energy
    1005: "", // Current Cryo Energy
    1006: "", // Current Geo Energy
    1010: "FIGHT_PROP_CUR_HP",
    2000: "FIGHT_PROP_MAX_HP",
    2001: "FIGHT_PROP_CUR_ATTACK",
    2002: "FIGHT_PROP_CUR_DEFENSE",
    2003: "FIGHT_PROP_CUR_SPEED",
};


/**
 * @en CharacterStatus
 */
class CharacterStatus {

    /**
     * @param {object} data
     * @param {EnkaClient} enka
     * @param {Element} element
     */
    constructor(data, enka, element) {
        /** @type {object} */
        this._data = data;

        /** @type {EnkaClient} */
        this.enka = enka;


        /** @type {StatusProperty} */
        this.healthBase = this.getStatusProperty(1);
        /** @type {StatusProperty} */
        this.healthFlat = this.getStatusProperty(2);
        /** @type {StatusProperty} */
        this.healthPercent = this.getStatusProperty(3);
        /** @type {StatusProperty} */
        this.attackBase = this.getStatusProperty(4);
        /** @type {StatusProperty} */
        this.attackFlat = this.getStatusProperty(5);
        /** @type {StatusProperty} */
        this.attackPercent = this.getStatusProperty(6);
        /** @type {StatusProperty} */
        this.defenseBase = this.getStatusProperty(7);
        /** @type {StatusProperty} */
        this.defenseFlat = this.getStatusProperty(8);
        /** @type {StatusProperty} */
        this.defensePercent = this.getStatusProperty(9);
        /** @type {StatusProperty} */
        this.speedBase = this.getStatusProperty(10);
        /** @type {StatusProperty} */
        this.speedPercent = this.getStatusProperty(11);
        /** @type {StatusProperty} */
        this.critRate = this.getStatusProperty(20);
        /** @type {StatusProperty} */
        this.critDamage = this.getStatusProperty(22);
        /** @type {StatusProperty} */
        this.chargeEfficiency = this.getStatusProperty(23);
        /** @type {StatusProperty} */
        this.healAdd = this.getStatusProperty(26);
        /** @type {StatusProperty} */
        this.healedAdd = this.getStatusProperty(27);
        /** @type {StatusProperty} */
        this.elementMastery = this.getStatusProperty(28);
        /** @type {StatusProperty} */
        this.physicalRes = this.getStatusProperty(29);
        /** @type {StatusProperty} */
        this.physicalDamage = this.getStatusProperty(30);
        /** @type {StatusProperty} */
        this.pyroDamage = this.getStatusProperty(40);
        /** @type {StatusProperty} */
        this.electroDamage = this.getStatusProperty(41);
        /** @type {StatusProperty} */
        this.hydroDamage = this.getStatusProperty(42);
        /** @type {StatusProperty} */
        this.dendroDamage = this.getStatusProperty(43);
        /** @type {StatusProperty} */
        this.anemoDamage = this.getStatusProperty(44);
        /** @type {StatusProperty} */
        this.geoDamage = this.getStatusProperty(45);
        /** @type {StatusProperty} */
        this.cryoDamage = this.getStatusProperty(46);
        /** @type {StatusProperty} */
        this.pyroRes = this.getStatusProperty(50);
        /** @type {StatusProperty} */
        this.electroRes = this.getStatusProperty(51);
        /** @type {StatusProperty} */
        this.hydroRes = this.getStatusProperty(52);
        /** @type {StatusProperty} */
        this.dendroRes = this.getStatusProperty(53);
        /** @type {StatusProperty} */
        this.anemoRes = this.getStatusProperty(54);
        /** @type {StatusProperty} */
        this.geoRes = this.getStatusProperty(55);
        /** @type {StatusProperty} */
        this.cryoRes = this.getStatusProperty(56);

        /**
         * Element damage bonus which matches the character's element. (Physical DMG ignored.)
         * @type {StatusProperty | null}
         */
        this.matchedElementDamage =
            element?.id === "Fire" ? this.pyroDamage :
                element?.id === "Electric" ? this.electroDamage :
                    element?.id === "Water" ? this.hydroDamage :
                        element?.id === "Grass" ? this.dendroDamage :
                            element?.id === "Wind" ? this.anemoDamage :
                                element?.id === "Rock" ? this.geoDamage :
                                    element?.id === "Ice" ? this.cryoDamage : null;

        /** @type {number} */
        this.pyroEnergyCost = data[70] ?? 0;
        /** @type {number} */
        this.electroEnergyCost = data[71] ?? 0;
        /** @type {number} */
        this.hydroEnergyCost = data[72] ?? 0;
        /** @type {number} */
        this.dendroEnergyCost = data[73] ?? 0;
        /** @type {number} */
        this.anemoEnergyCost = data[74] ?? 0;
        /** @type {number} */
        this.cryoEnergyCost = data[75] ?? 0;
        /** @type {number} */
        this.geoEnergyCost = data[76] ?? 0;

        /** @type {number} */
        this.energyCost = Math.max(
            this.pyroEnergyCost,
            this.electroEnergyCost,
            this.hydroEnergyCost,
            this.dendroEnergyCost,
            this.anemoEnergyCost,
            this.cryoEnergyCost,
            this.geoEnergyCost,
        );

        /** @type {StatusProperty} */
        this.cooldownReduction = this.getStatusProperty(80);
        /** @type {StatusProperty} */
        this.shieldStrength = this.getStatusProperty(81);

        /** @type {number} */
        this.currentPyroEnergy = data[1000] ?? 0;
        /** @type {number} */
        this.currentElectroEnergy = data[1001] ?? 0;
        /** @type {number} */
        this.currentHydroEnergy = data[1002] ?? 0;
        /** @type {number} */
        this.currentDendroEnergy = data[1003] ?? 0;
        /** @type {number} */
        this.currentAnemoEnergy = data[1004] ?? 0;
        /** @type {number} */
        this.currentCryoEnergy = data[1005] ?? 0;
        /** @type {number} */
        this.currentGeoEnergy = data[1006] ?? 0;

        /** @type {number} */
        this.currentEnergy = Math.max(
            this.currentPyroEnergy,
            this.currentElectroEnergy,
            this.currentHydroEnergy,
            this.currentDendroEnergy,
            this.currentAnemoEnergy,
            this.currentCryoEnergy,
            this.currentGeoEnergy,
        );

        /** @type {StatusProperty} */
        this.currentHealth = this.getStatusProperty(1010);

        /** @type {StatusProperty} */
        this.maxHealth = this.getStatusProperty(2000);
        /** Current Attack @type {StatusProperty} */
        this.attack = this.getStatusProperty(2001);
        /** Current Defense @type {StatusProperty} */
        this.defense = this.getStatusProperty(2002);
        /** Current Speed @type {StatusProperty} */
        this.speed = this.getStatusProperty(2003);

        /** @type {Array<StatusProperty>} */
        this.statusProperties = Object.values(this).filter(value => value instanceof StatusProperty);
    }
    /**
     * @private
     * @param {number} id
     * @param {number} [defaultValue]
     * @returns {StatusProperty}
     */
    getStatusProperty(id, defaultValue = 0) {
        return new StatusProperty(fightProps[id], this._data[id] ?? defaultValue, this.enka);
    }
}

module.exports = CharacterStatus;