export = PassiveTalent;
declare class PassiveTalent {
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
    /** @type {ImageAssets} */
    icon: ImageAssets;
}
import EnkaClient = require("../../client/EnkaClient");
import ImageAssets = require("../assets/ImageAssets");
