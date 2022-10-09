const EnkaClient = require("../../client/EnkaClient");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const TextAssets = require("../assets/TextAssets");

module.exports = class CharacterStatusProperty {
    /** 
     * @param {string} id
     * @param {number} value
     * @param {boolean} isPercent
     * @param {EnkaClient} enka
     */
    constructor(id, value, isPercent, enka) {
        /** @type {string} */
        this.id = id;

        /** @type {object} */
        this._propData = require(enka.cachedAssetsManager.getJSONDataPath("ManualTextMapConfigData")).find(t => t.textMapId === id);
        if (!this._propData) throw new AssetsNotFoundError("Fight Prop", id);

        /** @type {TextAssets} */
        this.type = new TextAssets(this._propData.textMapContentTextMapHash, enka);

        /** @type {boolean} */
        this.isPercent = isPercent;

        /** @type {number} */
        this.value = value;
    }
}