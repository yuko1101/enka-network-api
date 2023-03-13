export = Element;
/**
 * @en Element
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
    /** @type {Object<string, any>} */
    _data: {
        [x: string]: any;
    };
    /** @type {TextAssets} */
    name: TextAssets;
}
import EnkaClient = require("../client/EnkaClient");
import TextAssets = require("./assets/TextAssets");
