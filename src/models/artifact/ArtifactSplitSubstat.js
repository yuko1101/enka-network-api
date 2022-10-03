const EnkaClient = require("../../client/EnkaClient");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const TextAssets = require("../assets/TextAssets");

module.exports = class ArtifactSplitSubstat {
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
        this._data = require(enka.cachedAssetsManager.getAssetsPath("data", "ReliquaryAffixExcelConfigData")).find(a => a.id === id);
        if (!this._data) throw new AssetsNotFoundError("Artifact Substat", id);

        /** @type {TextAssets} */
        this.type = new TextAssets("fight_props", this._data.propType, enka);

        /** @type {number} */
        this.value = this._data.propValue;
    }
}