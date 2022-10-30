const EnkaClient = require("../../client/EnkaClient");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const ImageAssets = require("../assets/ImageAssets");
const TextAssets = require("../assets/TextAssets");

module.exports = class Costume {
    /** 
     * @param {number} id
     * @param {EnkaClient} enka
     */
    constructor(id, enka) {

        /** @type {number} */
        this.id = id;

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {object} */
        this._data = require(enka.cachedAssetsManager.getJSONDataPath("AvatarCostumeExcelConfigData")).find(c => c.OGKFGGNLLDG === id);

        if (!this._data) throw new AssetsNotFoundError("Costume", id);

        /** @type {TextAssets} */
        this.name = new TextAssets(this._data.nameTextMapHash, enka);

        /** @type {TextAssets} */
        this.description = new TextAssets(this._data.descTextMapHash, enka);

        /** @type {number} */
        this.characterId = this._data.AKOANLMAFDD;

        /** @type {boolean} */
        this.isDefault = !!this._data.isDefault;

        /** @type {string} */
        this._nameId = this._data.IFIODPDADEI.slice(this._data.IFIODPDADEI.lastIndexOf("_") + 1);

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.IFIODPDADEI);

        /** @type {ImageAssets} */
        this.sideIcon = new ImageAssets(this._data.sideIconName);

        /** @type {ImageAssets} */
        this.splashImage = new ImageAssets(`UI_Costume_${this._nameId}`);

    }
}