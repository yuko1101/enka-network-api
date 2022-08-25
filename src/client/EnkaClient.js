const User = require("../models/User");
const UserNotFoundError = require("../errors/UserNotFoundError");
const { bindOptions } = require("../utils/utils");

const fetch = require("node-fetch"); // for nodejs 16 or below

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
    }

    /** 
     * @param {number} uid
     * @returns {Promise<User>}
     */
    async fetchUser(uid) {
        if (typeof uid !== "number") throw new Error("Parameter `uid` must be a number.");
        const url = getUserUrl(uid);
        const abortController = new AbortController();
        setTimeout(() => abortController.abort("timeout"), this.options.timeout);
        const response = await fetch(url, {
            headers: { "User-Agent": this.options.userAgent },
            signal: abortController.signal,
        });


        if (response.status !== 200) {
            throw new UserNotFoundError(`User with uid ${uid} was not found.`);
        }
        const data = await response.json();
        return User(data);
    }

}