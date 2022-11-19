const EnkaClient = require("../client/EnkaClient");
const AssetsNotFoundError = require("../errors/AssetsNotFoundError");
const ImageAssets = require("./assets/ImageAssets");
const TextAssets = require("./assets/TextAssets");

/** 
 * @en NameCard
 */
class NameCard {

    /** 
     * @param {number} id
     * @param {EnkaClient} enka
     * @param {object} [data] If `data` provided, use `data` instead of searching with `id`.
     */
    constructor(id, enka, data = null) {

        /** @type {number} */
        this.id = id;

        /** @type {EnkaClient} */
        this.enka = enka;


        /** @type {object} */
        this._data = data ?? require(enka.cachedAssetsManager.getJSONDataPath("MaterialExcelConfigData")).find(m => m.id === id);

        if (!this._data) throw new AssetsNotFoundError("NameCard", id);

        /** @type {TextAssets} */
        this.name = new TextAssets(this._data.nameTextMapHash, enka);

        /** @type {TextAssets} */
        this.description = new TextAssets(this._data.descTextMapHash, enka);

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.icon);

        /** @type {Array<ImageAssets>} */
        this.pictures = this._data.picPath.map(name => new ImageAssets(name));

    }
}

module.exports = NameCard;