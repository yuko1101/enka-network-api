const { fightProps } = require("../../utils/constants");
const StatusProperty = require("../StatusProperty");

/**
 * @en CharacterStatus
 */
class CharacterStatus {

    /**
     * @param {Object<string, any>} data
     * @param {import("../../client/EnkaClient")} enka
     * @param {import("../Element")} element
     */
    constructor(data, enka, element) {
        /** @type {Object<string, any>} */
        this._data = data;

        /** @type {import("../../client/EnkaClient")} */
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

        const sortedDamageBonus = [this.pyroDamage, this.electroDamage, this.hydroDamage, this.dendroDamage, this.anemoDamage, this.geoDamage, this.cryoDamage, this.physicalDamage].sort((a, b) => b.value - a.value);
        /**
         * Including physical damage bonus.
         * If there are more than two highest ones, this will be null.
         * @type {StatusProperty | null}
         * @deprecated Use CharacterStatus#highestDamageBonus instead.
         */
        this.maxElementDamage = sortedDamageBonus[0].value === sortedDamageBonus[1].value ? null : sortedDamageBonus[0];

        const highestDamageBonusList = sortedDamageBonus.filter(d => d.value === sortedDamageBonus[0].value);
        if (highestDamageBonusList.length > 1) highestDamageBonusList.sort((a, b) => this.matchedElementDamage?.id === a.id ? -1 : this.matchedElementDamage?.id === b.id ? 1 : 0);
        /**
         * Including physical damage bonus, and returns list of highest damage bonus.
         * The order of the list is such that elemental matches come first.
         * @type {Array<StatusProperty>}
         */
        this.highestDamageBonus = highestDamageBonusList;


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