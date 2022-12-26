const EnkaClient = require("../../client/EnkaClient");
const { percent } = require("../../utils/prop_utils");
const TextAssets = require("../assets/TextAssets");

/** 
 * @en ArtifactMainstat
 */
class ArtifactMainstat {

    /**
     * @param {{mainPropId: string, statValue: number}} data 
     * @param {EnkaClient} enka
     */
    constructor(data, enka) {

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {{mainPropId: string, statValue: number}} */
        this._data = data;

        /** @type {object} */
        this._propData = enka.cachedAssetsManager.getGenshinCacheData("ManualTextMapConfigData").find(t => t.textMapId === data.mainPropId);
        if (!this._propData) throw new AssetsNotFoundError("Fight Prop", data.mainPropId);

        /** @type {TextAssets} */
        this.type = new TextAssets(this._propData.textMapContentTextMapHash, enka);

        /** @type {boolean} */
        this.isPercent = percent.includes(data.mainPropId);

        /** @type {string} */
        this.value = data.statValue;
    }
}

module.exports = ArtifactMainstat;