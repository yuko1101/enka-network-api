import EnkaNetworkError from "./EnkaNetworkError";

/**
 * @en InvalidUidFormatError
 * @extends {EnkaNetworkError}
 */
export default class InvalidUidFormatError extends EnkaNetworkError {
    readonly uid: string | number;

    constructor(uid: number | string, statusCode: number, statusMessage: string) {
        super(`Invalid UID format. (${uid} provided.)`, statusCode, statusMessage);

        /** @type {string} */
        this.name = "InvalidUidFormatError";

        /** @type {number | string} */
        this.uid = uid;
    }
}