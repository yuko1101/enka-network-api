/** 
 * @exports UserNotFoundError
 * @module enka-network-api
 */
class UserNotFoundError extends Error {

    constructor(message) {
        super(message);
        this.name = "UserNotFoundError";
    }
}

module.exports = UserNotFoundError;