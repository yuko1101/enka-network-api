import { renameKeys } from "../../utils/object_utils";

/**
 * @en EnkaUser
 */
export default class EnkaUser {

    /**
     * @param {Object<string, any>} data
     * @param {import("../../client/EnkaClient")} enka
     * @param {string} username
     * @param {number | string} [uid] For players who do not have uid in multiplayer profile (who do not have unlocked multiplayer yet).
     */
    constructor(data, enka, username, uid = null) {

        /** @type {Object<string, any>} */
        this._data = data;

        /** @type {import("../../client/EnkaClient")} */
        this.enka = enka;

        /**
         * enka.network username, not in-game nickname
         * @type {string}
        */
        this.username = username;

        /** @type {string} */
        this.hash = data.hash;

        const User = require("../User");
        const fixedData = renameKeys(data, { "player_info": "playerInfo" });
        /** @type {User} */
        this.user = new User(fixedData, enka, uid);

        /** @type {number | null} */
        this.uid = data.uid ?? null;

        /** @type {boolean} */
        this.isVerified = data.verified;

        /** @type {boolean} */
        this.isPublic = data.public;

        /** @type {boolean} */
        this.isUidPublic = data.uid_public;

        /** @type {string} */
        this.verificationCode = data.verification_code;

        /** @type {Date} */
        this.verificationExpires = new Date(data.verification_expire);

        /** @type {number} */
        this.verificationCodeRetries = data.verification_code_retries;

        /**
         * https://cdn.discordapp.com/attachments/971472744820650035/1072868537472925767/image.png
         * @type {""|"CN"|"B"|"NA"|"EU"|"ASIA"|"TW"}
         */
        this.region = data.region;

        /** @type {number} */
        this.order = data.order;

        /** @type {string} */
        this.url = `${enka.options.enkaUrl}/u/${username}/${this.hash}`;
    }

    /**
     * @returns {Promise<Object<string, Array<import("./CharacterBuild")>>>}
     */
    async fetchBuilds() {
        return await this.enka.fetchEnkaUserBuilds(this.username, this.hash);
    }
}