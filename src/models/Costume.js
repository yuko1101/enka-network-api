const EnkaClient = require("../client/EnkaClient");
const ImageAssets = require("./assets/ImageAssets");
const TextAssets = require("./assets/TextAssets");

module.exports = class Costume {
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
        this._data = require(enka.cachedAssetsManager.getAssetsPath("data", "costumes"))[id];

        if (!this._data) throw new AssetsNotFoundError("Costume", id);

        /** @type {TextAssets} */
        this.name = new TextAssets("skills", `${this._data.nameTextMapHash}`, enka);

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.iconName);

        /** @type {ImageAssets} */
        this.sideIcon = new ImageAssets(this._data.sideIconName);
    }
}