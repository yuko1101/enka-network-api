const EnkaClient = require("../../client/EnkaClient");
const TextAssets = require("../assets/TextAssets");

/** 
 * @exports ArtifactTotalSubstat
 * @module enka-network-api
 */
class ArtifactTotalSubstat {

    /**
     * @param {{appendPropId: string, statValue: number}} data 
     * @param {EnkaClient} enka
     */
    constructor(data, enka) {

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {{appendPropId: string, statValue: number}} */
        this._data = data;

        /** @type {object} */
        this._propData = require(enka.cachedAssetsManager.getJSONDataPath("ManualTextMapConfigData")).find(t => t.textMapId === data.appendPropId);
        if (!this._propData) throw new AssetsNotFoundError("Fight Prop", data.appendPropId);

        /** @type {TextAssets} */
        this.type = new TextAssets(this._propData.textMapContentTextMapHash, enka);

        /** @type {string} */
        this.value = data.statValue;
    }
}

module.exports = ArtifactTotalSubstat;