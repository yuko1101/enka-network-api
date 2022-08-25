module.exports = class UserNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "UserNotFoundError";
    }
}