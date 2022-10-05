export = ArtifactSplitSubstat;
declare class ArtifactSplitSubstat {
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
    /** @type {object} */
    _propData: object;
    /** @type {TextAssets} */
    type: TextAssets;
    /** @type {number} */
    value: number;
}
import EnkaClient = require("../../client/EnkaClient");
import TextAssets = require("../assets/TextAssets");
