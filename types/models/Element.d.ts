export = Element;
/**
 * @en Element
 */
declare class Element {
    /**
     * @param {ElementType} id
     * @param {import("../client/EnkaClient")} enka
     */
    constructor(id: ElementType, enka: import("../client/EnkaClient"));
    /** @type {ElementType} */
    id: ElementType;
    /** @type {import("../client/EnkaClient")} */
    enka: import("../client/EnkaClient");
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
import TextAssets = require("./assets/TextAssets");
