const EnkaClient = require("../../client/EnkaClient");
const TextAssets = require("../assets/TextAssets");

module.exports = class CharacterStatusProperty {
    /** 
     * @param {string} id
     * @param {number} value
     * @param {EnkaClient} enka
     */
    constructor(id, value, enka) {
        /** @type {string} */
        this.id = id;

        /** @type {object} */
        this._propData = require(enka.cachedAssetsManager.getJSONDataPath("ManualTextMapConfigData")).find(t => t.textMapId === id);
        if (!this._propData) throw new AssetsNotFoundError("Fight Prop", id);

        /** @type {TextAssets} */
        this.type = new TextAssets(this._propData.textMapContentTextMapHash, enka);

        /** @type {number} */
        this.value = value;
    }
}