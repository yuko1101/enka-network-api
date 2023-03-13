// eslint-disable-next-line no-unused-vars
const EnkaClient = require("../../client/EnkaClient");
const WeaponRefinement = require("./WeaponRefinement");

/**
 * @en WeaponRefinements
 */
class WeaponRefinements {

    /**
     * @param {number} id
     * @param {EnkaClient} enka
     */
    constructor(id, enka) {

        /** @type {number} */
        this.id = id;

        /** @type {EnkaClient} */
        this.enka = enka;


        /** @type {Array<Object<string, any>>} */
        this._data = enka.cachedAssetsManager.getGenshinCacheData("EquipAffixExcelConfigData").filter(a => a.id === id).sort((a, b) => a.level - b.level);

        /** @type {Array<WeaponRefinement>} */
        this.refinements = this._data.map(r => new WeaponRefinement(r, enka));

    }
}

module.exports = WeaponRefinements;