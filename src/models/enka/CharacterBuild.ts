import Character from "../character/Character";

/**
 * @en CharacterBuild
 */
export default class CharacterBuild {

    /**
     * @param {Object<string, any>} data
     * @param {import("../../client/EnkaClient")} enka
     * @param {string} username
     * @param {string} hash
     */
    constructor(data, enka, username, hash) {

        /** @type {Object<string, any>} */
        this._data = data;

        /** @type {import("../../client/EnkaClient")} */
        this.enka = enka;

        /** @type {{username: string, hash: string}} */
        this.enkaUserInfo = { username: username, hash: hash };

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

        /** @type {string} */
        this.url = `${this.enka.options.enkaUrl}/u/${this.enkaUserInfo.username}/${this.enkaUserInfo.hash}/${this.character.characterData.id}/${this.id}`;
    }
}