export = ArtifactSet;
/**
 * @en ArtifactSet
 */
declare class ArtifactSet {
    /**
     * @param {number} id
     * @param {EnkaClient} enka
     */
    constructor(id: number, enka: EnkaClient);
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {number} */
    id: number;
    /** @type {object} */
    _data: object;
    /** @type {Array<object>} */
    _setBonusData: Array<object>;
    /** @type {Array<ArtifactSetBonus>} */
    setBonus: Array<ArtifactSetBonus>;
    /** @type {ImageAssets} */
    icon: ImageAssets;
    /** @type {TextAssets} */
    name: TextAssets;
}
import EnkaClient = require("../../client/EnkaClient");
import ArtifactSetBonus = require("./ArtifactSetBonus");
import ImageAssets = require("../assets/ImageAssets");
import TextAssets = require("../assets/TextAssets");
