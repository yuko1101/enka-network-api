const EnkaClient = require("../../client/EnkaClient");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const ImageAssets = require("../assets/ImageAssets");
const TextAssets = require("../assets/TextAssets");
const WeaponRefinement = require("./WeaponRefinement");
const WeaponRefinements = require("./WeaponRefinements");

/** 
 * @exports
 * @module enka-network-api
 */
class WeaponData {

    /**
     * @param {number} id
     * @param {EnkaClient} enka
     */
    constructor(id, enka) {

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {number} */
        this.id = id;


        /** @type {object} */
        this._data = require(enka.cachedAssetsManager.getJSONDataPath("WeaponExcelConfigData")).find(w => w.id === id);
        if (!this._data) throw new AssetsNotFoundError("Weapon", id);

        /** @type {TextAssets} */
        this.name = new TextAssets(this._data.nameTextMapHash, enka);

        /** @type {TextAssets} */
        this.description = new TextAssets(this._data.descTextMapHash, enka);

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.icon);

        /** @type {ImageAssets} */
        this.awakenIcon = new ImageAssets(this._data.awakenIcon);

        /** @type {number} */
        this.stars = this._data.rankLevel;

        /** @type {"WEAPON_SWORD_ONE_HAND" | "WEAPON_CLAYMORE" | "WEAPON_POLE" | "WEAPON_CATALYST" | "WEAPON_BOW"} */
        this.weaponType = this._data.weaponType;

        /** @type {object} */
        this._weaponTypeData = require(enka.cachedAssetsManager.getJSONDataPath("ManualTextMapConfigData")).find(t => t.textMapId === this.weaponType);
        if (!this._weaponTypeData) throw new AssetsNotFoundError("Weapon Type", this.weaponType);

        /** @type {TextAssets} */
        this.weaponTypeName = new TextAssets(this._weaponTypeData.textMapContentTextMapHash, enka);

        /** @type {WeaponRefinement[]} */
        this.refinements = this._data.skillAffix[0] !== 0 ? new WeaponRefinements(this._data.skillAffix[0], enka).refinements : [];
    }
}

module.exports = WeaponData;