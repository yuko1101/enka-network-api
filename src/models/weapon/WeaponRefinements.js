const EnkaClient = require("../../client/EnkaClient");
const WeaponRefinement = require("./WeaponRefinement");

module.exports = class WeaponRefinements {
    /**
     * @param {number} id 
     * @param {EnkaClient} enka 
     */
    constructor(id, enka) {

        /** @type {number} */
        this.id = id;

        /** @type {EnkaClient} */
        this.enka = enka;


        /** @type {object[]} */
        this._data = require(enka.cachedAssetsManager.getJSONDataPath("EquipAffixExcelConfigData")).filter(a => a.id === id).sort((a, b) => a.level - b.level);

        /** @type {WeaponRefinement[]} */
        this.refinements = this._data.map(r => new WeaponRefinement(r, enka));

    }
}