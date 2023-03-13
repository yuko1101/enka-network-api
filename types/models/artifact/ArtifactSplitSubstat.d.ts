export = ArtifactSplitSubstat;
/**
 * @en ArtifactSplitSubstat
 * @extends {StatusProperty}
 */
declare class ArtifactSplitSubstat extends StatusProperty {
    /**
     * @param {number} id
     * @param {EnkaClient} enka
     */
    constructor(id: number, enka: EnkaClient);
    /** @type {Object<string, any>} */
    _data: {
        [x: string]: any;
    };
}
import StatusProperty = require("../StatusProperty");
import EnkaClient = require("../../client/EnkaClient");
