const EnkaClient = require("../../client/EnkaClient");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const { percent } = require("../../utils/prop_utils");
const TextAssets = require("../assets/TextAssets");

/** 
 * @en ArtifactSplitSubstat
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
        this._data = enka.cachedAssetsManager.getGenshinCacheData("ReliquaryAffixExcelConfigData").find(a => a.id === id);
        if (!this._data) throw new AssetsNotFoundError("Artifact Substat", id);

        /** @type {object} */
        this._propData = enka.cachedAssetsManager.getGenshinCacheData("ManualTextMapConfigData").find(t => t.textMapId === this._data.propType);
        if (!this._propData) throw new AssetsNotFoundError("Fight Prop", this._data.propType);

        /** @type {TextAssets} */
        this.type = new TextAssets(this._propData.textMapContentTextMapHash, enka);

        /** @type {boolean} */
        this.isPercent = percent.includes(this._data.propType);

        /** @type {number} */
        this.value = this._data.propValue;
    }
}

module.exports = ArtifactSplitSubstat;