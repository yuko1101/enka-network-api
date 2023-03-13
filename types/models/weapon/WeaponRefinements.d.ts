export = WeaponRefinements;
/**
 * @en WeaponRefinements
 */
declare class WeaponRefinements {
    /**
     * @param {number} id
     * @param {EnkaClient} enka
     */
    constructor(id: number, enka: EnkaClient);
    /** @type {number} */
    id: number;
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {Array<Object<string, any>>} */
    _data: Array<{
        [x: string]: any;
    }>;
    /** @type {Array<WeaponRefinement>} */
    refinements: Array<WeaponRefinement>;
}
import EnkaClient = require("../../client/EnkaClient");
import WeaponRefinement = require("./WeaponRefinement");
