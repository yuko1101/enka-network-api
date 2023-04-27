/**
 * @en EnkaNetworkError
 * @extends {Error}
 */
class EnkaNetworkError extends Error {
    readonly statusCode: number;
    readonly statusMessage: string;

    constructor(message: string, statusCode: number, statusMessage: string) {
        super(message);

        this.name = "EnkaNetworkError";

        this.statusCode = statusCode;

        this.statusMessage = statusMessage;
    }
}

export default EnkaNetworkError;