const EnkaClient = require("../client/EnkaClient");
const AssetsNotFoundError = require("../errors/AssetsNotFoundError");
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

        /** @type {{type: TextAssets, value: number, _propData: object}[]} */
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