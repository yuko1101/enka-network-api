export = ArtifactSplitSubstat;
/**
 * @en ArtifactSplitSubstat
 * @extends {StatusProperty}
 */
declare class ArtifactSplitSubstat extends StatusProperty {
    /**
     * @param {number} id
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(id: number, enka: import("../../client/EnkaClient"));
    /** @type {Object<string, any>} */
    _data: {
        [x: string]: any;
    };
}
import StatusProperty = require("../StatusProperty");
