export = Weapon;
/**
 * @en Weapon
 */
declare class Weapon {
    /**
     * @param {object} data
     * @param {EnkaClient} enka
     */
    constructor(data: object, enka: EnkaClient);
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {object} */
    _data: object;
    /** @type {WeaponData} */
    weaponData: WeaponData;
    /** @type {WeaponRefinement | null} */
    refinement: WeaponRefinement | null;
    /** @type {number} */
    level: number;
    /** @type {number} */
    ascension: number;
    /** @type {number} */
    maxLevel: number;
    /** @type {boolean} */
    isAwaken: boolean;
    /** @type {Array<StatusProperty>} */
    weaponStats: Array<StatusProperty>;
}
import EnkaClient = require("../../client/EnkaClient");
import WeaponData = require("./WeaponData");
import WeaponRefinement = require("./WeaponRefinement");
import StatusProperty = require("../StatusProperty");
