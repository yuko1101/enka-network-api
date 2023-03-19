const EnkaNetworkError = require("./EnkaNetworkError");

/**
 * @en InvalidUidFormatError
 * @extends {EnkaNetworkError}
 */
class InvalidUidFormatError extends EnkaNetworkError {

    /**
     * @param {number | string} uid
     * @param {number} statusCode
     * @param {string} statusMessage
     */
    constructor(uid, statusCode, statusMessage) {
        super(`Invalid UID format. (${uid} provided.)`, statusCode, statusMessage);

        /** @type {string} */
        this.name = "InvalidUidFormatError";

        /** @type {number | string} */
        this.uid = uid;
    }
}

module.exports = InvalidUidFormatError;