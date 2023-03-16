export = Material;
/**
 * @en Material
 */
declare class Material {
    /**
     * @param {number | string} id
     * @param {import("../../client/EnkaClient")} enka
     * @param {Object<string, any>} [data] If `data` provided, use `data` instead of searching with `id`.
     * @returns {Material}
     */
    static getMaterialById(id: number | string, enka: import("../../client/EnkaClient"), data?: {
        [x: string]: any;
    } | undefined): Material;
    /**
     * @param {number} id
     * @param {import("../../client/EnkaClient")} enka
     * @param {Object<string, any>} [data] If `data` provided, use `data` instead of searching with `id`.
     */
    constructor(id: number, enka: import("../../client/EnkaClient"), data?: {
        [x: string]: any;
    } | undefined);
    /** @type {number} */
    id: number;
    /** @type {import("../../client/EnkaClient")} */
    enka: import("../../client/EnkaClient");
    /** @type {Object<string, any>} */
    _data: {
        [x: string]: any;
    };
    /** @type {TextAssets} */
    name: TextAssets;
    /** @type {TextAssets} */
    description: TextAssets;
    /** @type {ImageAssets} */
    icon: ImageAssets;
    /** @type {Array<ImageAssets>} */
    pictures: Array<ImageAssets>;
    /** @type {"ITEM_VIRTUAL"|"ITEM_MATERIAL"} */
    itemType: "ITEM_VIRTUAL" | "ITEM_MATERIAL";
    /** @type {string | null} */
    materialType: string | null;
    /** @type {number} */
    stars: number;
}
import TextAssets = require("../assets/TextAssets");
import ImageAssets = require("../assets/ImageAssets");
