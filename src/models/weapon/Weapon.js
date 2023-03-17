// eslint-disable-next-line no-unused-vars
const EnkaClient = require("../../client/EnkaClient");
const StatusProperty = require("../StatusProperty");
const WeaponData = require("./WeaponData");
// eslint-disable-next-line no-unused-vars
const WeaponRefinement = require("./WeaponRefinement");

/**
 * @en Weapon
 */
class Weapon {

    /**
     * @param {Object<string, any>} data
     * @param {EnkaClient} enka
     */
    constructor(data, enka) {

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {Object<string, any>} */
        this._data = data;


        /** @type {WeaponData} */
        this.weaponData = new WeaponData(data.itemId, enka);

        /** @type {WeaponRefinement | null} */
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