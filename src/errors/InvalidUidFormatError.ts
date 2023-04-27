import EnkaNetworkError from "./EnkaNetworkError";

/**
 * @en InvalidUidFormatError
 * @extends {EnkaNetworkError}
 */
class InvalidUidFormatError extends EnkaNetworkError {
    readonly uid: string | number;

    constructor(uid: number | string, statusCode: number, statusMessage: string) {
        super(`Invalid UID format. (${uid} provided.)`, statusCode, statusMessage);

        this.name = "InvalidUidFormatError";

        this.uid = uid;
    }
}

export default InvalidUidFormatError;