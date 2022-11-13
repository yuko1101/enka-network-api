const request = require("request");
const EnkaClient = require("../client/EnkaClient");

/** 
 * @param {string} url
 * @param {EnkaClient} enka
 * @returns {Promise<request.Response>} 
 */
module.exports.fetchJSON = async (url, enka, enableTimeout = false) => {
    const options = { json: true, headers: { "User-Agent": enka.options.userAgent } };
    if (enableTimeout) options.timeout = enka.options.timeout;

    /** @type {request.Response} */
    const res = await new Promise((resolve, reject) => {
        request.get(url, options, (e, res, _) => {
            if (e) reject(e);
            resolve(res);
        });
    });

    return res;
}