export = WeaponRefinement;
declare class WeaponRefinement {
    /**
     * @param {object} data
     * @param {EnkaClient} enka
     */
    constructor(data: object, enka: EnkaClient);
    /** @type {object} */
    _data: object;
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {number} */
    level: number;
    /** @type {TextAssets} */
    name: TextAssets;
    /** @type {TextAssets} */
    description: TextAssets;
    /** @type {CharacterStatusProperty[]} */
    addProps: CharacterStatusProperty[];
    /** @type {number[]} */
    paramList: number[];
}
import EnkaClient = require("../../client/EnkaClient");
import TextAssets = require("../assets/TextAssets");
import CharacterStatusProperty = require("../character/CharacterStatusProperty");
