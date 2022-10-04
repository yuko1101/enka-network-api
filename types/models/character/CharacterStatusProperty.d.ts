export = CharacterStatusProperty;
declare class CharacterStatusProperty {
    /**
     * @param {number} id
     * @param {number} value
     * @param {EnkaClient} enka
     */
    constructor(id: number, value: number, enka: EnkaClient);
    /** @type {number} */
    id: number;
    /** @type {TextAssets} */
    type: TextAssets;
    /** @type {number} */
    value: number;
}
import TextAssets = require("../assets/TextAssets");
import EnkaClient = require("../../client/EnkaClient");
