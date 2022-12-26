const EnkaClient = require("../../client/EnkaClient");
const ArtifactData = require("./ArtifactData");
const TextAssets = require("../assets/TextAssets");
const ArtifactSplitSubstat = require("./ArtifactSplitSubstat");
const ArtifactTotalSubstat = require("./ArtifactTotalSubstat");
const ArtifactMainstat = require("./ArtifactMainstat");

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
class Artifact {

    /** 
     * @param {object} data
     * @param {EnkaClient} enka
     */
    constructor(data, enka) {

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {object} */
        this._data = data;


        /** @type {ArtifactData} */
        this.artifactData = new ArtifactData(data.itemId, Number(data.flat.setNameTextMapHash), enka);

        /** @type {number} */
        this.level = data.reliquary.level;

        /** @type {ArtifactMainstat} */
        this.mainstat = new ArtifactMainstat(data.flat.reliquaryMainstat, enka);

        /** @type {SubstatsContainer} */
        this.substats = {
            total: data.flat.reliquarySubstats?.map(obj => new ArtifactTotalSubstat(obj, enka)) ?? [],
            split: data.reliquary.appendPropIdList?.map(id => new ArtifactSplitSubstat(id, enka)) ?? []
        };

    }
}

module.exports = Artifact;