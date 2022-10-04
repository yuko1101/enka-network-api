export = CharacterStatus;
declare class CharacterStatus {
    /**
     * @param {object} data
     * @param {EnkaClient} enka
     */
    constructor(data: object, enka: EnkaClient);
    /** @type {object} */
    _data: object;
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {CharacterStatusProperty} */
    baseHP: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    baseAttack: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    baseDefense: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    critRate: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    critDamage: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    chargeEfficiency: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    healAdd: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    healedAdd: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    elementMastery: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    physicalRes: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    physicalDamage: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    pyroDamage: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    electroDamage: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    hydroDamage: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    dendroDamage: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    anemoDamage: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    geoDamage: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    cryoDamage: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    pyroRes: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    electroRes: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    hydroRes: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    dendroRes: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    anemoRes: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    geoRes: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    cryoRes: CharacterStatusProperty;
    /** @type {number} */
    pyroEnergyCost: number;
    /** @type {number} */
    electroEnergyCost: number;
    /** @type {number} */
    hydroEnergyCost: number;
    /** @type {number} */
    dendroEnergyCost: number;
    /** @type {number} */
    anemoEnergyCost: number;
    /** @type {number} */
    cryoEnergyCost: number;
    /** @type {number} */
    geoEnergyCost: number;
    /** @type {number} */
    energyCost: number;
    /** @type {number} */
    currentPyroEnergy: number;
    /** @type {number} */
    currentElectroEnergy: number;
    /** @type {number} */
    currentHydroEnergy: number;
    /** @type {number} */
    currentDendroEnergy: number;
    /** @type {number} */
    currentAnemoEnergy: number;
    /** @type {number} */
    currentCryoEnergy: number;
    /** @type {number} */
    currentGeoEnergy: number;
    /** @type {number} */
    currentEnergy: number;
    /** @type {CharacterStatusProperty} */
    currentHP: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    maxHP: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    attack: CharacterStatusProperty;
    /** @type {CharacterStatusProperty} */
    defense: CharacterStatusProperty;
    /**
     * @private
     * @param {number} id
     * @returns {CharacterStatusProperty}
     */
    private getStatusProperty;
}
import EnkaClient = require("../../client/EnkaClient");
import CharacterStatusProperty = require("./CharacterStatusProperty");
