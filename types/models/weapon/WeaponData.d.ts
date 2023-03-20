export = WeaponData;
/**
 * @en WeaponData
 */
declare class WeaponData {
    /**
     * @param {number} id
     * @param {import("../../client/EnkaClient")} enka
     * @param {Object<string, any>} [data] If `data` provided, use `data` instead of searching with `id`.
     */
    constructor(id: number, enka: import("../../client/EnkaClient"), data?: {
        [x: string]: any;
    } | undefined);
    /** @type {import("../../client/EnkaClient")} */
    enka: import("../../client/EnkaClient");
    /** @type {number} */
    id: number;
    /** @type {Object<string, any>} */
    _data: {
        [x: string]: any;
    };
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
    /** @type {WeaponType} */
    weaponType: WeaponType;
    /** @type {Object<string, any>} */
    _weaponTypeData: {
        [x: string]: any;
    };
    /** @type {TextAssets} */
    weaponTypeName: TextAssets;
    /** @type {Array<import("./WeaponRefinement")>} */
    refinements: Array<import("./WeaponRefinement")>;
}
declare namespace WeaponData {
    export { WeaponType };
}
import TextAssets = require("../assets/TextAssets");
import ImageAssets = require("../assets/ImageAssets");
type WeaponType = "WEAPON_SWORD_ONE_HAND" | "WEAPON_CLAYMORE" | "WEAPON_POLE" | "WEAPON_CATALYST" | "WEAPON_BOW";
