const EnkaClient = require("../../client/EnkaClient");
const TextAssets = require("../assets/TextAssets");

module.exports = class CharacterStatusProperty {
    /** 
     * @param {number} id
     * @param {number} value
     * @param {EnkaClient} enka
     */
    constructor(id, value, enka) {
        /** @type {number} */
        this.id = id;

        /** @type {TextAssets} */
        this.type = new TextAssets("fight_props", id, enka);

        /** @type {number} */
        this.value = value;
    }
}