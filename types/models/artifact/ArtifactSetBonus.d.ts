export = ArtifactSetBonus;
/**
 * @en ArtifactSetBonus
 */
declare class ArtifactSetBonus {
    /**
     * @param {number} needCount
     * @param {Object<string, any>} data
     * @param {EnkaClient} enka
     */
    constructor(needCount: number, data: {
        [x: string]: any;
    }, enka: EnkaClient);
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {number} */
    id: number;
    /** @type {number} */
    needCount: number;
    /** @type {TextAssets} */
    description: TextAssets;
    /** @type {Array<StatusProperty>} */
    addProps: Array<StatusProperty>;
    /** @type {Array<number>} */
    paramList: Array<number>;
}
import EnkaClient = require("../../client/EnkaClient");
import TextAssets = require("../assets/TextAssets");
import StatusProperty = require("../StatusProperty");
