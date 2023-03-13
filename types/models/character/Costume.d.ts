export = Costume;
/**
 * @en Costume
 */
declare class Costume {
    /**
     * @param {number} id
     * @param {EnkaClient} enka
     * @param {Object<string, any>} [data] If `data` provided, use `data` instead of searching with `id`.
     */
    constructor(id: number, enka: EnkaClient, data?: {
        [x: string]: any;
    } | undefined);
    /** @type {number} */
    id: number;
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {Object<string, any>} */
    _data: {
        [x: string]: any;
    };
    /** @type {TextAssets} */
    name: TextAssets;
    /** @type {TextAssets} */
    description: TextAssets;
    /** @type {number} */
    characterId: number;
    /** @type {boolean} */
    isDefault: boolean;
    /** @type {string} */
    _nameId: string;
    /** @type {ImageAssets} */
    icon: ImageAssets;
    /** @type {ImageAssets} */
    sideIcon: ImageAssets;
    /** @type {ImageAssets} */
    splashImage: ImageAssets;
    /** @type {number} */
    stars: number;
    /** @type {ImageAssets} */
    cardIcon: ImageAssets;
}
import EnkaClient = require("../../client/EnkaClient");
import TextAssets = require("../assets/TextAssets");
import ImageAssets = require("../assets/ImageAssets");
