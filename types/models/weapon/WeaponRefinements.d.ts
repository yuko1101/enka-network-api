export = WeaponRefinements;
/**
 * @exports
 * @module enka-network-api
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
    /** @type {object[]} */
    _data: object[];
    /** @type {WeaponRefinement[]} */
    refinements: WeaponRefinement[];
}
import EnkaClient = require("../../client/EnkaClient");
import WeaponRefinement = require("./WeaponRefinement");
