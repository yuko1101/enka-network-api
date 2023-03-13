// eslint-disable-next-line no-unused-vars
const EnkaClient = require("../../client/EnkaClient");
const TextAssets = require("../assets/TextAssets");
const StatusProperty = require("../StatusProperty");

/**
 * @en WeaponRefinement
 */
class WeaponRefinement {

    /**
     * @param {Object<string, any>} data
     * @param {EnkaClient} enka
     */
    constructor(data, enka) {
        /** @type {Object<string, any>} */
        this._data = data;

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {number} */
        this.level = data.level;

        /** @type {TextAssets} */
        this.name = new TextAssets(data.nameTextMapHash, enka);

        /** @type {TextAssets} */
        this.description = new TextAssets(data.descTextMapHash, enka);

        /** @type {Array<StatusProperty>} */
        this.addProps = data.addProps.filter(p => Object.keys(p).includes("propType") && Object.keys(p).includes("value")).map(p => new StatusProperty(p.propType, p.value, enka));

        /** @type {Array<number>} */
        this.paramList = data.paramList;
    }
}

module.exports = WeaponRefinement;