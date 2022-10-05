const EnkaClient = require("../client/EnkaClient");
const AssetsNotFoundError = require("../errors/AssetsNotFoundError");
const TextAssets = require("./assets/TextAssets");

module.exports = class Element {
    /** 
     * @param {string} id 
     * @param {EnkaClient} enka
     */
    constructor(id, enka) {

        /** @type {string} */
        this.id = id;

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {object} */
        this._data = require(enka.cachedAssetsManager.getJSONDataPath("ManualTextMapConfigData")).find(t => t.textMapId === id);
        if (!this._data) throw new AssetsNotFoundError("Element", id);

        /** @type {TextAssets} */
        this.name = new TextAssets(this._data.textMapContentTextMapHash, enka);
    }
}