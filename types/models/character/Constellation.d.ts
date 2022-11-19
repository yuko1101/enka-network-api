export = Constellation;
/**
 * @en Constellation
 */
declare class Constellation {
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
    /** @type {Array<CharacterStatusProperty>} */
    addProps: Array<CharacterStatusProperty>;
    /** @type {Array<number>} */
    paramList: Array<number>;
}
import EnkaClient = require("../../client/EnkaClient");
import TextAssets = require("../assets/TextAssets");
import ImageAssets = require("../assets/ImageAssets");
import CharacterStatusProperty = require("./CharacterStatusProperty");
