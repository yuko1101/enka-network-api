const EnkaClient = require("../../client/EnkaClient");
const ArtifactData = require("./ArtifactData");
const TextAssets = require("../assets/TextAssets");
const ArtifactSplitSubstat = require("./ArtifactSplitSubstat");
const ArtifactTotalSubstat = require("./ArtifactTotalSubstat");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");

/** 
 * @exports Artifact
 * @module enka-network-api
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

        const reliquaryMainstat = data.flat.reliquaryMainstat;

        /** @type {object} */
        this._propData = require(enka.cachedAssetsManager.getJSONDataPath("ManualTextMapConfigData")).find(t => t.textMapId === reliquaryMainstat.mainPropId);

        if (!this._propData) throw new AssetsNotFoundError("Fight Prop", reliquaryMainstat.mainPropId)

        /** @type {{type: TextAssets, statValue: number}} */
        this.mainstat = {
            type: new TextAssets(this._propData.textMapContentTextMapHash, enka),
            statValue: reliquaryMainstat.statValue
        };

        /** @type {Array<{split: Array<ArtifactSplitSubstat>, total: ArtifactTotalSubstat}>} */
        this.substats = {
            split: data.reliquary.appendPropIdList?.map(id => new ArtifactSplitSubstat(id, enka)) ?? [],
            total: data.flat.reliquarySubstats?.map(obj => new ArtifactTotalSubstat(obj, enka)) ?? []
        };


    }
}

module.exports = Artifact;