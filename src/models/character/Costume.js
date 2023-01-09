const EnkaClient = require("../../client/EnkaClient");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const ImageAssets = require("../assets/ImageAssets");
const TextAssets = require("../assets/TextAssets");

/** 
 * @en Costume
 */
class Costume {

    /** 
     * @param {number} id
     * @param {EnkaClient} enka
     * @param {object} [data] If `data` provided, use `data` instead of searching with `id`.
     */
    constructor(id, enka, data = null) {

        const keys = enka.cachedAssetsManager.getObjectKeysManager();

        /** @type {number} */
        this.id = data ? data[keys.costumeIdKey] : id;

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {object} */
        this._data = data ?? enka.cachedAssetsManager.getGenshinCacheData("AvatarCostumeExcelConfigData").find(c => c[keys.costumeIdKey] === id);

        if (!this._data) throw new AssetsNotFoundError("Costume", id);

        /** @type {TextAssets} */
        this.name = new TextAssets(this._data.nameTextMapHash, enka);

        /** @type {TextAssets} */
        this.description = new TextAssets(this._data.descTextMapHash, enka);

        /** @type {number} */
        this.characterId = this._data[keys.costumeCharacterIdKey]; // Previous key of "jsonName"

        /** @type {boolean} */
        this.isDefault = !!this._data.isDefault;

        if (!this.isDefault) {
            /** @type {string} */
            this._nameId = this._data.jsonName?.slice(this._data.jsonName.lastIndexOf("_") + 1);

            /** @type {ImageAssets} */
            this.icon = new ImageAssets(`UI_AvatarIcon_${this._nameId}`);

            /** @type {ImageAssets} */
            this.sideIcon = new ImageAssets(this._data.sideIconName);

            /** @type {ImageAssets} */
            this.splashImage = new ImageAssets(`UI_Costume_${this._nameId}`);

            /** @type {number} */
            this.stars = this._data[keys.costumeStarKey];
        }

        /** @type {ImageAssets} */
        this.cardIcon = new ImageAssets(this.isDefault ? "UI_AvatarIcon_Costume_Card" : `UI_AvatarIcon_${this._nameId}_Card`);
    }
}

module.exports = Costume;