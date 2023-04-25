/**
 * @en EnkaProfile
 */
export default class EnkaProfile {

    /**
     * @param {Object<string, any>} data
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(data, enka) {

        /** @type {Object<string, any>} */
        this._data = data;

        /** @type {import("../../client/EnkaClient")} */
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
     * @returns {Promise<Array<import("./EnkaUser")>>}
     */
    async fetchAllEnkaUsers() {
        return await this.enka.fetchAllEnkaUsers(this.username);
    }

    /**
     * @param {string} hash EnkaUser hash
     * @returns {Promise<Object<string, Array<import("./CharacterBuild")>>>}
     */
    async fetchEnkaUserBuilds(hash) {
        return await this.enka.fetchEnkaUserBuilds(this.username, hash);
    }

}