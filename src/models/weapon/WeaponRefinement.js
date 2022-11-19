const EnkaClient = require("../../client/EnkaClient");
const TextAssets = require("../assets/TextAssets");
const CharacterStatusProperty = require("../character/CharacterStatusProperty");

/** 
 * @en WeaponRefinement
 */
class WeaponRefinement {

    /** 
     * @param {object} data
     * @param {EnkaClient} enka
     */
    constructor(data, enka) {
        /** @type {object} */
        this._data = data;

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {number} */
        this.level = data.level;

        /** @type {TextAssets} */
        this.name = new TextAssets(data.nameTextMapHash, enka);

        /** @type {TextAssets} */
        this.description = new TextAssets(data.descTextMapHash, enka);

        /** @type {Array<CharacterStatusProperty>} */
        this.addProps = data.addProps.filter(p => p.hasOwnProperty("propType") && p.hasOwnProperty("value")).map(p => new CharacterStatusProperty(p.propType, p.value, enka));

        /** @type {Array<number>} */
        this.paramList = data.paramList;
    }
}

module.exports = WeaponRefinement;