const EnkaClient = require("../../client/EnkaClient");
const TextAssets = require("../assets/TextAssets");

module.exports = class ArtifactTotalSubstat {
    /**
     * @param {{appendPropId: string, statValue: number}} data 
     * @param {EnkaClient} enka
     */
    constructor(data, enka) {

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {{appendPropId: string, statValue: number}} */
        this._data = data;

        /** @type {TextAssets} */
        this.type = new TextAssets("fight_props", data.appendPropId, enka);

        /** @type {string} */
        this.value = data.statValue;
    }
}