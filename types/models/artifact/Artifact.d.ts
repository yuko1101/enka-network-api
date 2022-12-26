export = Artifact;
/**
 * @en SubstatsContainer
 * @typedef SubstatsContainer
 * @type {object}
 * @property {Array<ArtifactTotalSubstat>} total
 * @property {Array<ArtifactSplitSubstat>} split
 */
/**
 * @en Artifact
 */
declare class Artifact {
    /**
     * @param {object} data
     * @param {EnkaClient} enka
     */
    constructor(data: object, enka: EnkaClient);
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {object} */
    _data: object;
    /** @type {ArtifactData} */
    artifactData: ArtifactData;
    /** @type {number} */
    level: number;
    /** @type {ArtifactMainstat} */
    mainstat: ArtifactMainstat;
    /** @type {SubstatsContainer} */
    substats: SubstatsContainer;
}
declare namespace Artifact {
    export { SubstatsContainer };
}
import EnkaClient = require("../../client/EnkaClient");
import ArtifactData = require("./ArtifactData");
import ArtifactMainstat = require("./ArtifactMainstat");
type SubstatsContainer = {
    total: Array<ArtifactTotalSubstat>;
    split: Array<ArtifactSplitSubstat>;
};
import ArtifactTotalSubstat = require("./ArtifactTotalSubstat");
import ArtifactSplitSubstat = require("./ArtifactSplitSubstat");
