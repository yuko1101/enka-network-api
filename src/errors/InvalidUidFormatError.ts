import { EnkaNetworkError } from "enka-system";

/**
 * @en InvalidUidFormatError
 * @extends {EnkaNetworkError}
 */
class InvalidUidFormatError extends EnkaNetworkError {
    /** In-game UID of the user */
    readonly uid: string | number;

    /**
     * @param uid
     * @param statusCode
     * @param statusMessage
     */
    constructor(uid: number | string, statusCode: number, statusMessage: string) {
        super(`Invalid UID format. (${uid} provided.)`, statusCode, statusMessage);

        this.name = "InvalidUidFormatError";

        this.uid = uid;
    }
}

export default InvalidUidFormatError;