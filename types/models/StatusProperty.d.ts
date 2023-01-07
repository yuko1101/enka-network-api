export = StatusProperty;
/**
 * @en StatusProperty
 */
declare class StatusProperty {
    /**
     * @param {string} id
     * @param {number} value
     * @param {EnkaClient} enka
     */
    constructor(id: string, value: number, enka: EnkaClient, multiplied?: boolean);
    /** @type {string} */
    id: string;
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {object} */
    _propData: object;
    /** @type {TextAssets} */
    type: TextAssets;
    /** @type {boolean} */
    isPercent: boolean;
    /** @type {number} */
    value: number;
    /**
     * Multiply `value` by 100 if it is a percentage.
     * @returns {number}
     */
    getFormattedValue(): number;
}
import EnkaClient = require("../client/EnkaClient");
import TextAssets = require("./assets/TextAssets");
