export = NameCard;
declare class NameCard {
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
    /** @type {ImageAssets} */
    icon: ImageAssets;
    /** @type {ImageAssets[]} */
    pictures: ImageAssets[];
    /** @type {number} */
    rankLevel: number;
    /** @type {string} */
    materialType: string;
}
import EnkaClient = require("../client/EnkaClient");
import TextAssets = require("./assets/TextAssets");
import ImageAssets = require("./assets/ImageAssets");