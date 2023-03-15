export = Artifact;
/**
 * @en SubstatsContainer
 * @typedef SubstatsContainer
 * @type {object}
 * @property {Array<StatusProperty>} total
 * @property {Array<ArtifactSplitSubstat>} split
 */
/**
 * @en Artifact
 */
declare class Artifact {
    /**
     * @param {Object<string, any>} data
     * @param {EnkaClient} enka
     */
    constructor(data: {
        [x: string]: any;
    }, enka: EnkaClient);
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {Object<string, any>} */
    _data: {
        [x: string]: any;
    };
    /** @type {ArtifactData} */
    artifactData: ArtifactData;
    /** @type {number} */
    level: number;
    /** @type {StatusProperty} */
    mainstat: StatusProperty;
    /** @type {SubstatsContainer} */
    substats: SubstatsContainer;
}
declare namespace Artifact {
    export { SubstatsContainer };
}
import EnkaClient = require("../../client/EnkaClient");
import ArtifactData = require("./ArtifactData");
import StatusProperty = require("../StatusProperty");
type SubstatsContainer = {
    total: Array<StatusProperty>;
    split: Array<ArtifactSplitSubstat>;
};
import ArtifactSplitSubstat = require("./ArtifactSplitSubstat");
