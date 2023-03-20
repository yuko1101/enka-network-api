export = CharacterStatus;
/**
 * @en CharacterStatus
 */
declare class CharacterStatus {
    /**
     * @param {Object<string, any>} data
     * @param {import("../../client/EnkaClient")} enka
     * @param {import("../Element")} element
     */
    constructor(data: {
        [x: string]: any;
    }, enka: import("../../client/EnkaClient"), element: import("../Element"));
    /** @type {Object<string, any>} */
    _data: {
        [x: string]: any;
    };
    /** @type {import("../../client/EnkaClient")} */
    enka: import("../../client/EnkaClient");
    /** @type {StatusProperty} */
    healthBase: StatusProperty;
    /** @type {StatusProperty} */
    healthFlat: StatusProperty;
    /** @type {StatusProperty} */
    healthPercent: StatusProperty;
    /** @type {StatusProperty} */
    attackBase: StatusProperty;
    /** @type {StatusProperty} */
    attackFlat: StatusProperty;
    /** @type {StatusProperty} */
    attackPercent: StatusProperty;
    /** @type {StatusProperty} */
    defenseBase: StatusProperty;
    /** @type {StatusProperty} */
    defenseFlat: StatusProperty;
    /** @type {StatusProperty} */
    defensePercent: StatusProperty;
    /** @type {StatusProperty} */
    speedBase: StatusProperty;
    /** @type {StatusProperty} */
    speedPercent: StatusProperty;
    /** @type {StatusProperty} */
    critRate: StatusProperty;
    /** @type {StatusProperty} */
    critDamage: StatusProperty;
    /** @type {StatusProperty} */
    chargeEfficiency: StatusProperty;
    /** @type {StatusProperty} */
    healAdd: StatusProperty;
    /** @type {StatusProperty} */
    healedAdd: StatusProperty;
    /** @type {StatusProperty} */
    elementMastery: StatusProperty;
    /** @type {StatusProperty} */
    physicalRes: StatusProperty;
    /** @type {StatusProperty} */
    physicalDamage: StatusProperty;
    /** @type {StatusProperty} */
    pyroDamage: StatusProperty;
    /** @type {StatusProperty} */
    electroDamage: StatusProperty;
    /** @type {StatusProperty} */
    hydroDamage: StatusProperty;
    /** @type {StatusProperty} */
    dendroDamage: StatusProperty;
    /** @type {StatusProperty} */
    anemoDamage: StatusProperty;
    /** @type {StatusProperty} */
    geoDamage: StatusProperty;
    /** @type {StatusProperty} */
    cryoDamage: StatusProperty;
    /** @type {StatusProperty} */
    pyroRes: StatusProperty;
    /** @type {StatusProperty} */
    electroRes: StatusProperty;
    /** @type {StatusProperty} */
    hydroRes: StatusProperty;
    /** @type {StatusProperty} */
    dendroRes: StatusProperty;
    /** @type {StatusProperty} */
    anemoRes: StatusProperty;
    /** @type {StatusProperty} */
    geoRes: StatusProperty;
    /** @type {StatusProperty} */
    cryoRes: StatusProperty;
    /**
     * Element damage bonus which matches the character's element. (Physical DMG ignored.)
     * @type {StatusProperty | null}
     */
    matchedElementDamage: StatusProperty | null;
    /**
     * Including physical damage bonus.
     * If there are more than two highest ones, this will be null.
     * @type {StatusProperty | null}
     * @deprecated Use CharacterStatus#highestDamageBonus instead.
     */
    maxElementDamage: StatusProperty | null;
    /**
     * Including physical damage bonus, and returns list of highest damage bonus.
     * The order of the list is such that elemental matches come first.
     * Returns null if highest damage bonus is 0 or less.
     * @type {Array<StatusProperty> | null}
     */
    highestDamageBonus: Array<StatusProperty> | null;
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
    /** @type {StatusProperty} */
    cooldownReduction: StatusProperty;
    /** @type {StatusProperty} */
    shieldStrength: StatusProperty;
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
    /** @type {StatusProperty} */
    currentHealth: StatusProperty;
    /** @type {StatusProperty} */
    maxHealth: StatusProperty;
    /** Current Attack @type {StatusProperty} */
    attack: StatusProperty;
    /** Current Defense @type {StatusProperty} */
    defense: StatusProperty;
    /** Current Speed @type {StatusProperty} */
    speed: StatusProperty;
    /** @type {Array<StatusProperty>} */
    statusProperties: Array<StatusProperty>;
    /**
     * @private
     * @param {number} id
     * @param {number} [defaultValue]
     * @returns {StatusProperty}
     */
    private getStatusProperty;
}
import StatusProperty = require("../StatusProperty");
