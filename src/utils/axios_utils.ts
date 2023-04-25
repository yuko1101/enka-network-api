import { Axios } from "axios";

const axios = new Axios({});

/**
 * @param {string} url
 * @param {import("../client/EnkaClient")} enka
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export async function fetchJSON(url, enka, enableTimeout = false) {
    const options = { headers: { "User-Agent": enka.options.userAgent } };
    if (enableTimeout) options.timeout = enka.options.timeout;

    const res = await axios.get(url, options);

    try {
        res.data = JSON.parse(res.data);
    } catch (e) {
        // do not parse if it is not json due to some error
    }

    return res;
}
