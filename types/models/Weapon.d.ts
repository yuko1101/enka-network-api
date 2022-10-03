export = Weapon;
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
    /** @type {number} */
    refinement: number;
    /** @type {number} */
    level: number;
    /** @type {number} */
    promoteLevel: number;
    /** @type {{type: TextAssets, value: number}[]} */
    weaponStats: {
        type: TextAssets;
        value: number;
    }[];
}
import EnkaClient = require("../client/EnkaClient");
import WeaponData = require("./WeaponData");
import TextAssets = require("./assets/TextAssets");
