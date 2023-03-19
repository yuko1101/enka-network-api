const StatusProperty = require("../StatusProperty");
const WeaponData = require("./WeaponData");

/**
 * @en Weapon
 */
class Weapon {

    /**
     * @param {Object<string, any>} data
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(data, enka) {

        /** @type {import("../../client/EnkaClient")} */
        this.enka = enka;

        /** @type {Object<string, any>} */
        this._data = data;


        /** @type {WeaponData} */
        this.weaponData = new WeaponData(data.itemId, enka);

        /** @type {import("./WeaponRefinement") | null} */
        this.refinement = this.weaponData.refinements[data.weapon.affixMap?.[this.weaponData._data.skillAffix[0]] ?? 0] ?? null;

        /** @type {number} */
        this.refinementRank = this.refinement?.level ?? 1;

        /** @type {number} */
        this.level = data.weapon.level;

        /** @type {number} */
        this.ascension = data.weapon.promoteLevel ?? 0;

        /** @type {number} */
        this.maxLevel = (this.ascension + 1) * 20 - (this.ascension > 1 ? (this.ascension - 1) * 10 : 0);

        /** @type {boolean} */
        this.isAwaken = this.ascension >= 2;

        /** @type {Array<StatusProperty>} */
        this.weaponStats = data.flat.weaponStats.map(obj => new StatusProperty(obj.appendPropId, obj.statValue, enka, true));

    }
}

module.exports = Weapon;