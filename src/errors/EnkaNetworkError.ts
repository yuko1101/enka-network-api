/**
 * @en EnkaNetworkError
 * @extends {Error}
 */
export default class EnkaNetworkError extends Error {
    public statusCode: number;
    public statusMessage: string;

    /**
     * @param {string} message
     * @param {number} statusCode
     * @param {string} statusMessage
     */
    constructor(message: string, statusCode: number, statusMessage: string) {
        super(message);

        /** @type {string} */
        this.name = "EnkaNetworkError";

        /** @type {number} */
        this.statusCode = statusCode;

        /** @type {string} */
        this.statusMessage = statusMessage;
    }
}