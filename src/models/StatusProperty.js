const EnkaClient = require("../client/EnkaClient");
const AssetsNotFoundError = require("../errors/AssetsNotFoundError");
const { percent } = require("../utils/prop_utils");
const TextAssets = require("./assets/TextAssets");

/** 
 * @en StatusProperty
 */
class StatusProperty {

    /** 
     * @param {string} id
     * @param {number} value
     * @param {EnkaClient} enka
     */
    constructor(id, value, enka, multiplied = false) {
        /** @type {string} */
        this.id = id;

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {object} */
        this._propData = enka.cachedAssetsManager.getGenshinCacheData("ManualTextMapConfigData").find(t => t.textMapId === id);
        if (!this._propData) throw new AssetsNotFoundError("Fight Prop", id);

        /** @type {TextAssets} */
        this.type = new TextAssets(this._propData.textMapContentTextMapHash, enka);

        /** @type {boolean} */
        this.isPercent = percent.includes(id);

        /** @type {number} */
        this.value = (multiplied && this.isPercent) ? value / 100 : value;
    }

    /**
     * Multiply `value` by 100 if it is a percentage.
     * @returns {number}
     */
    getFormattedValue() {
        return this.value * (this.isPercent ? 100 : 1);
    }
}

module.exports = StatusProperty;