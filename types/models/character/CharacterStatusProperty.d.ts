export = CharacterStatusProperty;
/**
 * @en CharacterStatusProperty
 */
declare class CharacterStatusProperty {
    /**
     * @param {string} id
     * @param {number} value
     * @param {EnkaClient} enka
     */
    constructor(id: string, value: number, enka: EnkaClient);
    /** @type {string} */
    id: string;
    /** @type {object} */
    _propData: object;
    /** @type {TextAssets} */
    type: TextAssets;
    /** @type {boolean} */
    isPercent: boolean;
    /** @type {number} */
    value: number;
}
import TextAssets = require("../assets/TextAssets");
import EnkaClient = require("../../client/EnkaClient");
