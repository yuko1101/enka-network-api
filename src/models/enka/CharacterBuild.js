// eslint-disable-next-line no-unused-vars
const EnkaClient = require("../../client/EnkaClient");
const Character = require("../character/Character");

/**
 * @en CharacterBuild
 */
class CharacterBuild {

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
        this.id = data.id;

        /** @type {string} */
        this.name = data.name;

        /** @type {number} */
        this.order = data.order;

        /** @type {boolean} */
        this.isLive = data.live;

        /** @type {boolean} */
        this.isPublic = data.public;

        /** @type {Character} */
        this.character = new Character(data.avatar_data, enka);
    }
}

module.exports = CharacterBuild;