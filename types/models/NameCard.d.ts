export = NameCard;
/**
 * @exports
 * @module enka-network-api
 */
declare class NameCard {
    /**
     * @param {number} id
     * @param {EnkaClient} enka
     */
    constructor(id: number, enka: EnkaClient);
    /** @type {number} */
    id: number;
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {object} */
    _data: object;
    /** @type {TextAssets} */
    name: TextAssets;
    /** @type {TextAssets} */
    description: TextAssets;
    /** @type {ImageAssets} */
    icon: ImageAssets;
    /** @type {ImageAssets[]} */
    pictures: ImageAssets[];
}
import EnkaClient = require("../client/EnkaClient");
import TextAssets = require("./assets/TextAssets");
import ImageAssets = require("./assets/ImageAssets");
