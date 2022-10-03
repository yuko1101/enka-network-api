const EnkaClient = require("../../client/EnkaClient");
const ArtifactData = require("./ArtifactData");
const TextAssets = require("../assets/TextAssets");
const ArtifactSplitSubstat = require("./ArtifactSplitSubstat");
const ArtifactTotalSubstat = require("./ArtifactTotalSubstat");

module.exports = class Artifact {
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
        this.artifactData = new ArtifactData(`${data.itemId}`, data.flat.setNameTextMapHash, enka);

        /** @type {number} */
        this.level = data.reliquary.level;

        const reliquaryMainstat = data.flat.reliquaryMainstat;

        /** @type {{type: TextAssets, statValue: number}} */
        this.mainstat = {
            type: new TextAssets("fight_props", reliquaryMainstat.mainPropId, enka),
            statValue: reliquaryMainstat.statValue
        };

        /** @type {{split: ArtifactSplitSubstat[], total: ArtifactTotalSubstat[]}} */
        this.substats = {
            split: data.reliquary.appendPropIdList.map(id => new ArtifactSplitSubstat(id, enka)),
            total: data.flat.reliquarySubstats.map(obj => new ArtifactTotalSubstat(obj, enka))
        };


    }
}