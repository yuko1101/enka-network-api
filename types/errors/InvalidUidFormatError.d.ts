export = InvalidUidFormatError;
/**
 * @en InvalidUidFormatError
 * @extends {EnkaNetworkError}
 */
declare class InvalidUidFormatError extends EnkaNetworkError {
    /**
     * @param {number | string} uid
     * @param {number} statusCode
     * @param {string} statusMessage
     */
    constructor(uid: number | string, statusCode: number, statusMessage: string);
    /** @type {number | string} */
    uid: number | string;
}
import EnkaNetworkError = require("./EnkaNetworkError");
