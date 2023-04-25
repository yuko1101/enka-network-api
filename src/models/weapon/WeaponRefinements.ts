import WeaponRefinement from "./WeaponRefinement";

/**
 * @en WeaponRefinements
 */
export default class WeaponRefinements {

    /**
     * @param {number} id
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(id, enka) {

        /** @type {number} */
        this.id = id;

        /** @type {import("../../client/EnkaClient")} */
        this.enka = enka;


        /** @type {Array<Object<string, any>>} */
        this._data = enka.cachedAssetsManager.getGenshinCacheData("EquipAffixExcelConfigData").filter(a => a.id === id).sort((a, b) => a.level - b.level);

        /** @type {Array<WeaponRefinement>} */
        this.refinements = this._data.map(r => new WeaponRefinement(r, enka));

    }
}