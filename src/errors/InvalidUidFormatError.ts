import EnkaNetworkError from "./EnkaNetworkError";

/**
 * @en InvalidUidFormatError
 * @extends {EnkaNetworkError}
 */
export default class InvalidUidFormatError extends EnkaNetworkError {
    public uid: string | number;

    /**
     * @param {number | string} uid
     * @param {number} statusCode
     * @param {string} statusMessage
     */
    constructor(uid: number | string, statusCode: number, statusMessage: string) {
        super(`Invalid UID format. (${uid} provided.)`, statusCode, statusMessage);

        /** @type {string} */
        this.name = "InvalidUidFormatError";

        /** @type {number | string} */
        this.uid = uid;
    }
}