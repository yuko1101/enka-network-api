export = Element;
/**
 * @en Element
 */
declare class Element {
    /**
     * @param {ElementType} id
     * @param {EnkaClient} enka
     */
    constructor(id: ElementType, enka: EnkaClient);
    /** @type {ElementType} */
    id: ElementType;
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {Object<string, any>} */
    _data: {
        [x: string]: any;
    };
    /** @type {TextAssets} */
    name: TextAssets;
}
declare namespace Element {
    export { ElementType };
}
type ElementType = "Wind" | "Rock" | "Electric" | "Grass" | "Water" | "Fire" | "Ice";
import EnkaClient = require("../client/EnkaClient");
import TextAssets = require("./assets/TextAssets");
