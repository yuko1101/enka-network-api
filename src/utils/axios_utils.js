const { Axios, AxiosResponse } = require("axios");
const EnkaClient = require("../client/EnkaClient");

const axios = new Axios({});

/** 
 * @param {string} url
 * @param {EnkaClient} enka
 * @returns {Promise<AxiosResponse>} 
 */
module.exports.fetchJSON = async (url, enka, enableTimeout = false) => {
    const options = { headers: { "User-Agent": enka.options.userAgent, "accept-encoding": "*" } };
    if (enableTimeout) options.timeout = enka.options.timeout;

    const res = await axios.get(url, options);

    res.data = JSON.parse(res.data);

    return res;
}