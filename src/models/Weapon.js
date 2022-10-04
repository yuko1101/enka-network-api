const EnkaClient = require("../client/EnkaClient");
const TextAssets = require("./assets/TextAssets");
const WeaponData = require("./WeaponData");

module.exports = class Weapon {
    /**
     * @param {object} data
     * @param {EnkaClient} enka
     */
    constructor(data, enka) {

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {object} */
        this._data = data;


        /** @type {WeaponData} */
        this.weaponData = new WeaponData(data.itemId, enka);

        /** @type {number} */
        this.refinement = data.weapon.affixMap[`1${data.itemId}`] ?? 0;

        /** @type {number} */
        this.level = data.weapon.level;

        /** @type {number} */
        this.promoteLevel = data.weapon.promoteLevel;

        /** @type {{type: TextAssets, value: number}[]} */
        this.weaponStats = data.flat.weaponStats.map(obj => {
            return {
                type: new TextAssets("fight_props", obj.appendPropId, enka),
                value: obj.statValue
            };
        });

    }
}