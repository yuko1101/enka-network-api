import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import ImageAssets from "../assets/ImageAssets";
import TextAssets from "../assets/TextAssets";
import WeaponRefinements from "./WeaponRefinements";

/**
 * @en WeaponData
 */
export default class WeaponData {

    /**
     * @param {number} id
     * @param {import("../../client/EnkaClient")} enka
     * @param {Object<string, any>} [data] If `data` provided, use `data` instead of searching with `id`.
     */
    constructor(id, enka, data = null) {

        /** @type {import("../../client/EnkaClient")} */
        this.enka = enka;

        /** @type {number} */
        this.id = id;


        /** @type {Object<string, any>} */
        this._data = data ?? enka.cachedAssetsManager.getGenshinCacheData("WeaponExcelConfigData").find(w => w.id === id);
        if (!this._data) throw new AssetsNotFoundError("Weapon", id);

        /** @type {TextAssets} */
        this.name = new TextAssets(this._data.nameTextMapHash, enka);

        /** @type {TextAssets} */
        this.description = new TextAssets(this._data.descTextMapHash, enka);

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.icon, enka);

        /** @type {ImageAssets} */
        this.awakenIcon = new ImageAssets(this._data.awakenIcon, enka);

        /** @type {number} */
        this.stars = this._data.rankLevel;

        /** @type {WeaponType} */
        this.weaponType = this._data.weaponType;

        /** @type {Object<string, any>} */
        this._weaponTypeData = enka.cachedAssetsManager.getGenshinCacheData("ManualTextMapConfigData").find(t => t.textMapId === this.weaponType);
        if (!this._weaponTypeData) throw new AssetsNotFoundError("Weapon Type", this.weaponType);

        /** @type {TextAssets} */
        this.weaponTypeName = new TextAssets(this._weaponTypeData.textMapContentTextMapHash, enka);

        /** @type {Array<import("./WeaponRefinement")>} */
        this.refinements = this._data.skillAffix[0] !== 0 ? new WeaponRefinements(this._data.skillAffix[0], enka).refinements : [];
    }
}

/**
 * @en WeaponType
 * @typedef WeaponType
 * @type {"WEAPON_SWORD_ONE_HAND" | "WEAPON_CLAYMORE" | "WEAPON_POLE" | "WEAPON_CATALYST" | "WEAPON_BOW"}
 */