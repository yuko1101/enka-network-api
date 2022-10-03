const EnkaClient = require("../client/EnkaClient");
const AssetsNotFoundError = require("../errors/AssetsNotFoundError");
const ImageAssets = require("./assets/ImageAssets");
const TextAssets = require("./assets/TextAssets");

module.exports = class NameCard {
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
        this._data = require(enka.cachedAssetsManager.getAssetsPath("data", "namecards"))[id];

        if (!this._data) throw new AssetsNotFoundError("NameCard", id);

        /** @type {TextAssets} */
        this.name = new TextAssets("namecards", `${this._data.nameTextMapHash}`, enka);

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.icon);

        /** @type {ImageAssets[]} */
        this.pictures = this._data.picPath.map(name => new ImageAssets(name));

        /** @type {number} */
        this.rankLevel = this._data.rankLevel;

        /** @type {string} */
        this.materialType = this._data.materialType;

    }
}