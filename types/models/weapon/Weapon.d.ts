export = Weapon;
/**
 * @en Weapon
 */
declare class Weapon {
    /**
     * @param {Object<string, any>} data
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(data: {
        [x: string]: any;
    }, enka: import("../../client/EnkaClient"));
    /** @type {import("../../client/EnkaClient")} */
    enka: import("../../client/EnkaClient");
    /** @type {Object<string, any>} */
    _data: {
        [x: string]: any;
    };
    /** @type {WeaponData} */
    weaponData: WeaponData;
    /** @type {import("./WeaponRefinement") | null} */
    refinement: import("./WeaponRefinement") | null;
    /** @type {number} */
    refinementRank: number;
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
import WeaponData = require("./WeaponData");
import StatusProperty = require("../StatusProperty");
