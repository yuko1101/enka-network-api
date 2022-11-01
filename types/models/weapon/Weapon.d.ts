export = Weapon;
/**
 * @exports
 * @module enka-network-api
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
    /** @type {WeaponRefinement} */
    refinement: WeaponRefinement;
    /** @type {number} */
    level: number;
    /** @type {number} */
    promoteLevel: number;
    /** @type {{type: TextAssets, value: number, _propData: object}[]} */
    weaponStats: {
        type: TextAssets;
        value: number;
        _propData: object;
    }[];
}
import EnkaClient = require("../../client/EnkaClient");
import WeaponData = require("./WeaponData");
import WeaponRefinement = require("./WeaponRefinement");
import TextAssets = require("../assets/TextAssets");
