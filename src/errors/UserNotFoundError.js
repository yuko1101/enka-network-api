const EnkaNetworkError = require("./EnkaNetworkError");

/**
 * @en UserNotFoundError
 * @extends {EnkaNetworkError}
 */
class UserNotFoundError extends EnkaNetworkError {

    constructor(message) {
        super(message);
        this.name = "UserNotFoundError";
    }
}

module.exports = UserNotFoundError;