import { Axios, AxiosResponse, AxiosRequestConfig } from "axios";
import EnkaClient from "../client/EnkaClient";

const axios = new Axios({});

/**
 * @param url
 * @param enka
 * @param enableTimeout
 */
export async function fetchJSON(url: string, enka: EnkaClient, enableTimeout = false): Promise<AxiosResponse> {
    const options: AxiosRequestConfig = { headers: { "User-Agent": enka.options.userAgent } };
    if (enableTimeout) options.timeout = enka.options.timeout;

    const res = await axios.get(url, options);

    try {
        res.data = JSON.parse(res.data);
    } catch (e) {
        // do not parse if it is not json due to some error
    }

    return res;
}
