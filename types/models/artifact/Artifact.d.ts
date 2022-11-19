export = Artifact;
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
    /** @type {object} */
    _propData: object;
    /** @type {{type: TextAssets, statValue: number}} */
    mainstat: {
        type: TextAssets;
        statValue: number;
    };
    /** @type {Array<{split: Array<ArtifactSplitSubstat>, total: ArtifactTotalSubstat}>} */
    substats: {
        split: Array<ArtifactSplitSubstat>;
        total: ArtifactTotalSubstat;
    }[];
}
import EnkaClient = require("../../client/EnkaClient");
import ArtifactData = require("./ArtifactData");
import TextAssets = require("../assets/TextAssets");
import ArtifactSplitSubstat = require("./ArtifactSplitSubstat");
import ArtifactTotalSubstat = require("./ArtifactTotalSubstat");
