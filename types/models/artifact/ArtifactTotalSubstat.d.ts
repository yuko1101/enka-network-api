export = ArtifactTotalSubstat;
/**
 * @en ArtifactTotalSubstat
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
    /** @type {boolean} */
    isPercent: boolean;
    /**
     * @type {string}
     * @description Already multiplied by 100 if the value is a percentage.
     */
    value: string;
}
import EnkaClient = require("../../client/EnkaClient");
import TextAssets = require("../assets/TextAssets");
