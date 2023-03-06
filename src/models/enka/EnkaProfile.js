// eslint-disable-next-line no-unused-vars
const EnkaClient = require("../../client/EnkaClient");
// eslint-disable-next-line no-unused-vars
const EnkaUser = require("./EnkaUser");

/**
 * @en EnkaProfile
 */
class EnkaProfile {

    /**
     * @param {object} data
     * @param {EnkaClient} enka
     */
    constructor(data, enka) {

        /** @type {object} */
        this._data = data;

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {string} */
        this.username = data.username;

        /** @type {string} */
        this.bio = data.profile.bio;

        /** @type {string | null} */
        this.avatar = data.profile.avatar;

        /** @type {string | null} */
        this.imageUrl = data.profile.image_url ?? null;

        /** @type {number} */
        this.level = data.profile.level;

        /** @type {number} */
        this.signupState = data.profile.signup_state;

        /** @type {string} */
        this.url = `${enka.options.enkaUrl}/u/${this.username}`;
    }

    /**
     * @returns {Promise<Array<EnkaUser>>}
     */
    async fetchAllEnkaUsers() {
        return await this.enka.fetchAllEnkaUsers(this.username);
    }

    /**
     * @param {string} hash EnkaUser hash
     * @returns {Promise<Object<string, Array<CharacterBuild>>>}
     */
    async fetchEnkaUserBuilds(hash) {
        return await this.enka.fetchEnkaUserBuilds(this.username, hash);
    }

}

module.exports = EnkaProfile;