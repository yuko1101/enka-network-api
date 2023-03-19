/**
 * @en EnkaNetworkError
 * @extends {Error}
 */
class EnkaNetworkError extends Error {

    /**
     * @param {string} message
     * @param {number} statusCode
     * @param {string} statusMessage
     */
    constructor(message, statusCode, statusMessage) {
        super(message);

        /** @type {string} */
        this.name = "EnkaNetworkError";

        /** @type {number} */
        this.statusCode = statusCode;

        /** @type {string} */
        this.statusMessage = statusMessage;
    }
}

module.exports = EnkaNetworkError;