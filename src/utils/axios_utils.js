// eslint-disable-next-line no-unused-vars
const { Axios, AxiosResponse } = require("axios");
// eslint-disable-next-line no-unused-vars
const EnkaClient = require("../client/EnkaClient");

const axios = new Axios({});

/**
 * @param {string} url
 * @param {EnkaClient} enka
 * @returns {Promise<AxiosResponse>}
 */
module.exports.fetchJSON = async (url, enka, enableTimeout = false) => {
    const options = { headers: { "User-Agent": enka.options.userAgent } };
    if (enableTimeout) options.timeout = enka.options.timeout;

    const res = await axios.get(url, options);

    try {
        res.data = JSON.parse(res.data);
    } catch (e) {
    }

    return res;
};
