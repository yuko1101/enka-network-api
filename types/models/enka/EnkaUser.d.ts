export = EnkaUser;
/**
 * @en EnkaUser
 */
declare class EnkaUser {
    /**
     * @param {object} data
     * @param {EnkaClient} enka
     * @param {string} username
     * @param {number | string} [uid] For players who do not have uid in multiplayer profile (who do not have unlocked multiplayer yet).
     */
    constructor(data: object, enka: EnkaClient, username: string, uid?: string | number | undefined);
    /** @type {object} */
    _data: object;
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /**
     * enka.network username, not in-game nickname
     * @type {string}
    */
    username: string;
    /** @type {string} */
    hash: string;
    /** @type {User} */
    user: import("../User");
    /** @type {number | null} */
    uid: number | null;
    /** @type {boolean} */
    isVerified: boolean;
    /** @type {boolean} */
    isPublic: boolean;
    /** @type {boolean} */
    isUidPublic: boolean;
    /** @type {string} */
    verificationCode: string;
    /** @type {Date} */
    verificationExpires: Date;
    /** @type {number} */
    verificationCodeRetries: number;
    /**
     * https://cdn.discordapp.com/attachments/971472744820650035/1072868537472925767/image.png
     * @type {""|"CN"|"B"|"NA"|"EU"|"ASIA"|"TW"}
     */
    region: "" | "CN" | "B" | "NA" | "EU" | "ASIA" | "TW";
    /** @type {number} */
    order: number;
    /** @type {string} */
    url: string;
    /**
     * @returns {Promise<Object<string, Array<import("./CharacterBuild")>>>}
     */
    fetchBuilds(): Promise<{
        [x: string]: Array<import("./CharacterBuild")>;
    }>;
}
import EnkaClient = require("../../client/EnkaClient");
