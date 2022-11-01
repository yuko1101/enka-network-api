export = Element;
/**
 * @exports
 * @module enka-network-api
 */
declare class Element {
    /**
     * @param {string} id
     * @param {EnkaClient} enka
     */
    constructor(id: string, enka: EnkaClient);
    /** @type {string} */
    id: string;
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {object} */
    _data: object;
    /** @type {TextAssets} */
    name: TextAssets;
}
import EnkaClient = require("../client/EnkaClient");
import TextAssets = require("./assets/TextAssets");
