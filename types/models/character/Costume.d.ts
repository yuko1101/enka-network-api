export = Costume;
declare class Costume {
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
}
import EnkaClient = require("../../client/EnkaClient");
import TextAssets = require("../assets/TextAssets");
import ImageAssets = require("../assets/ImageAssets");
