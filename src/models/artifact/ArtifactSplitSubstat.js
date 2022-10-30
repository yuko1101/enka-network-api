const EnkaClient = require("../../client/EnkaClient");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const TextAssets = require("../assets/TextAssets");

/** 
 * @exports
 * @module enka-network-api
 */
class ArtifactSplitSubstat {

    /**
     * @param {number} id 
     * @param {EnkaClient} enka
     */
    constructor(id, enka) {
        /** @type {number} */
        this.id = id;

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {object} */
        this._data = require(enka.cachedAssetsManager.getJSONDataPath("ReliquaryAffixExcelConfigData")).find(a => a.id === id);
        if (!this._data) throw new AssetsNotFoundError("Artifact Substat", id);

        /** @type {object} */
        this._propData = require(enka.cachedAssetsManager.getJSONDataPath("ManualTextMapConfigData")).find(t => t.textMapId === this._data.propType);
        if (!this._propData) throw new AssetsNotFoundError("Fight Prop", this._data.propType);

        /** @type {TextAssets} */
        this.type = new TextAssets(this._propData.textMapContentTextMapHash, enka);

        /** @type {number} */
        this.value = this._data.propValue;
    }
}

module.exports = ArtifactSplitSubstat;