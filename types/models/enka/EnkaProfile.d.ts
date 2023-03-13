export = EnkaProfile;
/**
 * @en EnkaProfile
 */
declare class EnkaProfile {
    /**
     * @param {Object<string, any>} data
     * @param {EnkaClient} enka
     */
    constructor(data: {
        [x: string]: any;
    }, enka: EnkaClient);
    /** @type {Object<string, any>} */
    _data: {
        [x: string]: any;
    };
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {string} */
    username: string;
    /** @type {string} */
    bio: string;
    /** @type {string | null} */
    avatar: string | null;
    /** @type {string | null} */
    imageUrl: string | null;
    /** @type {number} */
    level: number;
    /** @type {number} */
    signupState: number;
    /** @type {string} */
    url: string;
    /**
     * @returns {Promise<Array<EnkaUser>>}
     */
    fetchAllEnkaUsers(): Promise<Array<EnkaUser>>;
    /**
     * @param {string} hash EnkaUser hash
     * @returns {Promise<Object<string, Array<import("./CharacterBuild")>>>}
     */
    fetchEnkaUserBuilds(hash: string): Promise<{
        [x: string]: Array<import("./CharacterBuild")>;
    }>;
}
import EnkaClient = require("../../client/EnkaClient");
import EnkaUser = require("./EnkaUser");
