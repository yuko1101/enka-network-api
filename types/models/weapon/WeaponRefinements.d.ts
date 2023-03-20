export = WeaponRefinements;
/**
 * @en WeaponRefinements
 */
declare class WeaponRefinements {
    /**
     * @param {number} id
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(id: number, enka: import("../../client/EnkaClient"));
    /** @type {number} */
    id: number;
    /** @type {import("../../client/EnkaClient")} */
    enka: import("../../client/EnkaClient");
    /** @type {Array<Object<string, any>>} */
    _data: Array<{
        [x: string]: any;
    }>;
    /** @type {Array<WeaponRefinement>} */
    refinements: Array<WeaponRefinement>;
}
import WeaponRefinement = require("./WeaponRefinement");
