export = UpgradeCost;
/**
 * @en UpgradeCost
 */
declare class UpgradeCost {
    /**
     * @param {number} coinCost
     * @param {Array<Object<string, any>>} costItems
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(coinCost: number, costItems: Array<{
        [x: string]: any;
    }>, enka: import("../../client/EnkaClient"));
    /** @type {import("../../client/EnkaClient")} */
    enka: import("../../client/EnkaClient");
    /** @type {number} */
    coin: number;
    /** @type {Array<{material: Material, count: number}>} */
    items: {
        material: Material;
        count: number;
    }[];
}
import Material = require("./Material");
