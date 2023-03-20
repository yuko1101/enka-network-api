export = WeaponRefinement;
/**
 * @en WeaponRefinement
 */
declare class WeaponRefinement {
    /**
     * @param {Object<string, any>} data
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(data: {
        [x: string]: any;
    }, enka: import("../../client/EnkaClient"));
    /** @type {Object<string, any>} */
    _data: {
        [x: string]: any;
    };
    /** @type {import("../../client/EnkaClient")} */
    enka: import("../../client/EnkaClient");
    /** @type {number} */
    level: number;
    /** @type {TextAssets} */
    name: TextAssets;
    /** @type {TextAssets} */
    description: TextAssets;
    /** @type {Array<StatusProperty>} */
    addProps: Array<StatusProperty>;
    /** @type {Array<number>} */
    paramList: Array<number>;
}
import TextAssets = require("../assets/TextAssets");
import StatusProperty = require("../StatusProperty");
