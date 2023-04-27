import EnkaNetworkError from "./EnkaNetworkError";

/**
 * @en UserNotFoundError
 * @extends {EnkaNetworkError}
 */
class UserNotFoundError extends EnkaNetworkError {
    constructor(message: string, statusCode: number, statusMessage: string) {
        super(message, statusCode, statusMessage);
        this.name = "UserNotFoundError";
    }
}

export default UserNotFoundError;