const User = require("../models/User");
const UserNotFoundError = require("../errors/UserNotFoundError");
const { bindOptions } = require("../utils/options_utils");

const fetch = require("node-fetch"); // for nodejs 16 or below
const CachedAssetsManager = require("./CachedAssetsManager");

const getUserUrl = (uid) => `https://enka.network/u/${uid}/__data.json`;

module.exports = class EnkaClient {
    /**
     * @param {object} [options]
     * @param {string} [options.userAgent="Mozilla/5.0"]
     * @param {int} [options.timeout=3000] http request timeout in milliseconds
     */
    constructor(options) {
        /** @type {{userAgent: string, timeout: 3000}} */
        this.options = bindOptions({
            "userAgent": "Mozilla/5.0",
            "timeout": 3000
        }, options);

        /** @type {CachedAssetsManager} */
        this.cachedAssetsManager = new CachedAssetsManager(this);
    }

    /** 
     * @param {number} uid
     * @param {boolean} parse
     * @returns {Promise<User>}
     */
    async fetchUser(uid, parse = true) {
        if (typeof uid !== "number") throw new Error("Parameter `uid` must be a number.");

        const url = getUserUrl(uid);

        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort("timeout"), this.options.timeout);

        const response = await fetch(url, {
            headers: { "User-Agent": this.options.userAgent },
            signal: abortController.signal,
        });

        clearTimeout(timeoutId);

        if (response.status !== 200) {
            throw new UserNotFoundError(`User with uid ${uid} was not found.`);
        }
        const data = await response.json();
        return new User(data, parse, this);
    }

}