export = WeaponRefinement;
/**
 * @en WeaponRefinement
 */
declare class WeaponRefinement {
    /**
     * @param {Object<string, any>} data
     * @param {EnkaClient} enka
     */
    constructor(data: {
        [x: string]: any;
    }, enka: EnkaClient);
    /** @type {Object<string, any>} */
    _data: {
        [x: string]: any;
    };
    /** @type {EnkaClient} */
    enka: EnkaClient;
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
import EnkaClient = require("../../client/EnkaClient");
import TextAssets = require("../assets/TextAssets");
import StatusProperty = require("../StatusProperty");
