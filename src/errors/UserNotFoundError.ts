import EnkaNetworkError from "./EnkaNetworkError";

/**
 * @en UserNotFoundError
 * @extends {EnkaNetworkError}
 */
export default class UserNotFoundError extends EnkaNetworkError {

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