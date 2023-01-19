/**
 * @en EnkaNetworkError
 * @extends {Error}
 */
class EnkaNetworkError extends Error {

    constructor(message) {
        super(message);
        this.name = "EnkaNetworkError";
    }
}

module.exports = EnkaNetworkError;