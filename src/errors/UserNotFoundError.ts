import EnkaNetworkError from "./EnkaNetworkError";

/**
 * @en UserNotFoundError
 * @extends {EnkaNetworkError}
 */
export default class UserNotFoundError extends EnkaNetworkError {
    constructor(message: string, statusCode: number, statusMessage: string) {
        super(message, statusCode, statusMessage);
        this.name = "UserNotFoundError";
    }
}