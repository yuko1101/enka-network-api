export = WeaponData;
/**
 * @en WeaponData
 */
declare class WeaponData {
    /**
     * @param {number} id
     * @param {EnkaClient} enka
     * @param {object} [data] If `data` provided, use `data` instead of searching with `id`.
     */
    constructor(id: number, enka: EnkaClient, data?: object | undefined);
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {number} */
    id: number;
    /** @type {object} */
    _data: object;
    /** @type {TextAssets} */
    name: TextAssets;
    /** @type {TextAssets} */
    description: TextAssets;
    /** @type {ImageAssets} */
    icon: ImageAssets;
    /** @type {ImageAssets} */
    awakenIcon: ImageAssets;
    /** @type {number} */
    stars: number;
    /** @type {"WEAPON_SWORD_ONE_HAND" | "WEAPON_CLAYMORE" | "WEAPON_POLE" | "WEAPON_CATALYST" | "WEAPON_BOW"} */
    weaponType: "WEAPON_SWORD_ONE_HAND" | "WEAPON_CLAYMORE" | "WEAPON_POLE" | "WEAPON_CATALYST" | "WEAPON_BOW";
    /** @type {object} */
    _weaponTypeData: object;
    /** @type {TextAssets} */
    weaponTypeName: TextAssets;
    /** @type {Array<WeaponRefinement>} */
    refinements: Array<WeaponRefinement>;
}
import EnkaClient = require("../../client/EnkaClient");
import TextAssets = require("../assets/TextAssets");
import ImageAssets = require("../assets/ImageAssets");
import WeaponRefinement = require("./WeaponRefinement");
