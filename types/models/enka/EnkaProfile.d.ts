export = EnkaProfile;
/**
 * @en EnkaProfile
 */
declare class EnkaProfile {
    /**
     * @param {object} data
     * @param {EnkaClient} enka
     */
    constructor(data: object, enka: EnkaClient);
    /** @type {object} */
    _data: object;
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
     * @returns {Promise<Object<string, Array<CharacterBuild>>>}
     */
    fetchEnkaUserBuilds(hash: string): Promise<{
        [x: string]: Array<CharacterBuild>;
    }>;
}
import EnkaClient = require("../../client/EnkaClient");
import EnkaUser = require("./EnkaUser");
