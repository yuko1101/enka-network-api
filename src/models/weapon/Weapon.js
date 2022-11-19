const EnkaClient = require("../../client/EnkaClient");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const TextAssets = require("../assets/TextAssets");
const WeaponData = require("./WeaponData");
const WeaponRefinement = require("./WeaponRefinement");

/** 
 * @exports Weapon
 * @module enka-network-api
 */
class Weapon {

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

        /** @type {WeaponRefinement} */
        this.refinement = this.weaponData.refinements[data.weapon.affixMap?.[this.weaponData._data.skillAffix[0]] ?? 0];

        /** @type {number} */
        this.level = data.weapon.level;

        /** @type {number} */
        this.promoteLevel = data.weapon.promoteLevel;

        /** @type {Array<{type: TextAssets, value: number, _propData: object}>} */
        this.weaponStats = data.flat.weaponStats.map(obj => {
            const propData = require(enka.cachedAssetsManager.getJSONDataPath("ManualTextMapConfigData")).find(t => t.textMapId === obj.appendPropId);
            if (!propData) throw new AssetsNotFoundError("Fight Prop", obj.appendPropId);
            return {
                type: new TextAssets(propData.textMapContentTextMapHash, enka),
                value: obj.statValue,
                _propData: propData
            };
        });

    }
}

module.exports = Weapon;