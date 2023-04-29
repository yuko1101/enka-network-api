/**
 * @en EnkaNetworkError
 * @extends {Error}
 */
class EnkaNetworkError extends Error {
    /** HTTP response status code from Enka.Network */
    readonly statusCode: number;
    /** The message of the status code */
    readonly statusMessage: string;

    /**
     * @param message
     * @param statusCode
     * @param statusMessage
     */
    constructor(message: string, statusCode: number, statusMessage: string) {
        super(message);

        this.name = "EnkaNetworkError";

        this.statusCode = statusCode;

        this.statusMessage = statusMessage;
    }
}

export default EnkaNetworkError;