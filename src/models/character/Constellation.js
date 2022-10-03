const EnkaClient = require("../../client/EnkaClient");
const ImageAssets = require("../assets/ImageAssets");
const TextAssets = require("../assets/TextAssets");

module.exports = class Constellation {
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
        this._data = require(enka.cachedAssetsManager.getAssetsPath("data", "constellations"))[id];

        if (!this._data) throw new AssetsNotFoundError("Talent", id);

        /** @type {TextAssets} */
        this.name = new TextAssets("constellations", `${this._data.nameTextMapHash}`, enka);

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.icon);
    }
}