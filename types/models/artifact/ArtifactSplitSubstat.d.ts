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
    /** @type {object} */
    _data: object;
}
import StatusProperty = require("../StatusProperty");
import EnkaClient = require("../../client/EnkaClient");
