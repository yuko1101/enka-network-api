/**
 * @en EnkaNetworkError
 * @extends {Error}
 */
export default class EnkaNetworkError extends Error {
    readonly statusCode: number;
    readonly statusMessage: string;

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