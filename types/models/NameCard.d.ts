export = NameCard;
/**
 * @en NameCard
 */
declare class NameCard {
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
    /** @type {ImageAssets} */
    icon: ImageAssets;
    /** @type {Array<ImageAssets>} */
    pictures: Array<ImageAssets>;
}
import EnkaClient = require("../client/EnkaClient");
import TextAssets = require("./assets/TextAssets");
import ImageAssets = require("./assets/ImageAssets");
