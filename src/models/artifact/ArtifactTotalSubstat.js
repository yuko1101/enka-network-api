const EnkaClient = require("../../client/EnkaClient");
const { percent } = require("../../utils/prop_utils");
const TextAssets = require("../assets/TextAssets");

/** 
 * @en ArtifactTotalSubstat
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
        this._propData = enka.cachedAssetsManager.getGenshinCacheData("ManualTextMapConfigData").find(t => t.textMapId === data.appendPropId);
        if (!this._propData) throw new AssetsNotFoundError("Fight Prop", data.appendPropId);

        /** @type {TextAssets} */
        this.type = new TextAssets(this._propData.textMapContentTextMapHash, enka);

        /** @type {boolean} */
        this.isPercent = percent.includes(data.appendPropId);

        /** 
         * @type {string} 
         * @description Already multiplied by 100 if the value is a percentage.
         */
        this.value = data.statValue;
    }
}

module.exports = ArtifactTotalSubstat;