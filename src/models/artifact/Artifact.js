const ArtifactData = require("./ArtifactData");
const ArtifactSplitSubstat = require("./ArtifactSplitSubstat");
const StatusProperty = require("../StatusProperty");

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
class Artifact {

    /**
     * @param {Object<string, any>} data
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(data, enka) {

        /** @type {import("../../client/EnkaClient")} */
        this.enka = enka;

        /** @type {Object<string, any>} */
        this._data = data;


        /** @type {ArtifactData} */
        this.artifactData = new ArtifactData(data.itemId, enka);

        /** @type {number} */
        this.level = data.reliquary.level;

        /** @type {StatusProperty} */
        this.mainstat = new StatusProperty(data.flat.reliquaryMainstat.mainPropId, data.flat.reliquaryMainstat.statValue, enka, true);

        /** @type {SubstatsContainer} */
        this.substats = {
            total: data.flat.reliquarySubstats?.map(obj => new StatusProperty(obj.appendPropId, obj.statValue, enka, true)) ?? [],
            split: data.reliquary.appendPropIdList?.map(id => new ArtifactSplitSubstat(id, enka)) ?? [],
        };

    }
}

module.exports = Artifact;