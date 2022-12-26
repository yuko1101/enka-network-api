export = ArtifactMainstat;
/**
 * @en ArtifactMainstat
 */
declare class ArtifactMainstat {
    /**
     * @param {{mainPropId: string, statValue: number}} data
     * @param {EnkaClient} enka
     */
    constructor(data: {
        mainPropId: string;
        statValue: number;
    }, enka: EnkaClient);
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {{mainPropId: string, statValue: number}} */
    _data: {
        mainPropId: string;
        statValue: number;
    };
    /** @type {object} */
    _propData: object;
    /** @type {TextAssets} */
    type: TextAssets;
    /** @type {boolean} */
    isPercent: boolean;
    /** @type {string} */
    value: string;
}
import EnkaClient = require("../../client/EnkaClient");
import TextAssets = require("../assets/TextAssets");
