// eslint-disable-next-line no-unused-vars
const EnkaClient = require("../../client/EnkaClient");
const { renameKeys } = require("../../utils/object_utils");

/**
 * @en EnkaUser
 */
class EnkaUser {

    /**
     * @param {object} data
     * @param {EnkaClient} enka
     * @param {number | string} [uid] For players who do not have uid in multiplayer profile (who do not have unlocked multiplayer yet).
     */
    constructor(data, enka, uid = null) {

        /** @type {object} */
        this._data = data;

        /** @type {EnkaClient} */
        this.enka = enka;

        const User = require("../User");
        const fixedData = renameKeys(data, { "player_info": "playerInfo" });
        /** @type {User} */
        this.user = new User(fixedData, enka, uid);

        /** @type {boolean} */
        this.isVerified = data.verified;

        /** @type {boolean} */
        this.isPublic = data.public;

        /** @type {boolean} */
        this.isUidPublic = data.uid_public;

        /** @type {string} */
        this.hash = data.hash;

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
    }
}

module.exports = EnkaUser;