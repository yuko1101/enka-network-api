export = EnkaNetworkError;
/**
 * @en EnkaNetworkError
 * @extends {Error}
 */
declare class EnkaNetworkError extends Error {
    /**
     * @param {string} message
     * @param {number} statusCode
     * @param {string} statusMessage
     */
    constructor(message: string, statusCode: number, statusMessage: string);
    /** @type {number} */
    statusCode: number;
    /** @type {string} */
    statusMessage: string;
}
