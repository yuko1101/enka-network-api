const EnkaClient = require("../client/EnkaClient");
const AssetsNotFoundError = require("../errors/AssetsNotFoundError");
const ImageAssets = require("./assets/ImageAssets");
const TextAssets = require("./assets/TextAssets");

module.exports = class WeaponData {
    /**
     * @param {string} id
     * @param {EnkaClient} enka
     */
    constructor(id, enka) {

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {string} */
        this.id = id;


        /** @type {object} */
        this._data = require(enka.cachedAssetsManager.getAssetsPath("data", "WeaponExcelConfigData")).find(w => `${w.id}` === id);
        if (!this._data) throw new AssetsNotFoundError("Weapon", id);

        /** @type {TextAssets} */
        this.name = new TextAssets("weapons", `${this._data.nameTextMapHash}`, enka);

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.icon);

        /** @type {ImageAssets} */
        this.awakenIcon = new ImageAssets(this._data.awakenIcon);

        /** @type {number} */
        this.rankLevel = this._data.rankLevel;

        /** @type {"WEAPON_SWORD_ONE_HAND" | "WEAPON_CLAYMORE" | "WEAPON_POLE" | "WEAPON_CATALYST" | "WEAPON_BOW"} */
        this.weaponType = this._data.weaponType;


        // TODO: add more properties such as description
    }
}