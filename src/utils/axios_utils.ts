import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import EnkaClient from "../client/EnkaClient";
import { JsonObject } from "config_file.js";

export async function fetchJSON(url: string, enka: EnkaClient, enableTimeout = false): Promise<AxiosResponse> {
    const headers: JsonObject = { "User-Agent": enka.options.userAgent };
    if (enka.options.githubToken && url.startsWith("https://api.github.com/")) headers["Authorization"] = `Bearer ${enka.options.githubToken}`;

    const options: AxiosRequestConfig = { headers } as AxiosRequestConfig;
    if (enableTimeout) options.timeout = enka.options.requestTimeout;

    const res: AxiosResponse = await (async () => {
        try {
            return await axios.get(url, options);
        } catch (e) {
            if (typeof e === "object" && e && "response" in e) return e.response as AxiosResponse;
            else throw e;
        }
    })();


    if (res.data) {
        try {
            res.data = JSON.parse(res.data);
        } catch (e) {
            // do not parse if it is not json due to some error
        }
    }

    return res;
}
