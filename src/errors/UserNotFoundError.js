const EnkaNetworkError = require("./EnkaNetworkError");

/**
 * @en UserNotFoundError
 * @extends {EnkaNetworkError}
 */
class UserNotFoundError extends EnkaNetworkError {

    /**
     * @param {string} message
     * @param {number} statusCode
     * @param {string} statusMessage
     */
    constructor(message, statusCode, statusMessage) {
        super(message, statusCode, statusMessage);
        this.name = "UserNotFoundError";
    }
}

module.exports = UserNotFoundError;