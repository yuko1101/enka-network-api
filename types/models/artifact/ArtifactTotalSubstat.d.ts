export = ArtifactTotalSubstat;
/**
 * @exports
 * @module enka-network-api
 */
declare class ArtifactTotalSubstat {
    /**
     * @param {{appendPropId: string, statValue: number}} data
     * @param {EnkaClient} enka
     */
    constructor(data: {
        appendPropId: string;
        statValue: number;
    }, enka: EnkaClient);
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {{appendPropId: string, statValue: number}} */
    _data: {
        appendPropId: string;
        statValue: number;
    };
    /** @type {object} */
    _propData: object;
    /** @type {TextAssets} */
    type: TextAssets;
    /** @type {string} */
    value: string;
}
import EnkaClient = require("../../client/EnkaClient");
import TextAssets = require("../assets/TextAssets");
