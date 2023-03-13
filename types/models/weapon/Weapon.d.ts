export = Weapon;
/**
 * @en Weapon
 */
declare class Weapon {
    /**
     * @param {Object<string, any>} data
     * @param {EnkaClient} enka
     */
    constructor(data: {
        [x: string]: any;
    }, enka: EnkaClient);
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {Object<string, any>} */
    _data: {
        [x: string]: any;
    };
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
