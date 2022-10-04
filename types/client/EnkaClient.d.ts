export = EnkaClient;
declare class EnkaClient {
    /**
     * @param {object} [options]
     * @param {string} [options.userAgent="Mozilla/5.0"]
     * @param {int} [options.timeout=3000] http request timeout in milliseconds
     */
    constructor(options?: {
        userAgent?: string;
        timeout?: int;
    });
    /** @type {{userAgent: string, timeout: 3000}} */
    options: {
        userAgent: string;
        timeout: 3000;
    };
    /** @type {CachedAssetsManager} */
    cachedAssetsManager: CachedAssetsManager;
    /**
     * @param {number} uid
     * @param {boolean} parse
     * @returns {Promise<User>}
     */
    fetchUser(uid: number, parse?: boolean): Promise<User>;
}
import CachedAssetsManager = require("./CachedAssetsManager");
import User = require("../models/User");
