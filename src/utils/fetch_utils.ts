import fs from "fs";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { EnkaClient } from "../client/EnkaClient";
import { bindOptions, Complement, JsonObject } from "config_file.js";

export interface FetchStringOptions {
    url: string;
    enka: EnkaClient;
    enableTimeout: boolean;
    allowLocalFile: boolean;
};

export const defaultFetchStringOptions = {
    enableTimeout: false,
    allowLocalFile: false,
} as const satisfies Partial<FetchStringOptions>;

export async function fetchString(options: Complement<typeof defaultFetchStringOptions, FetchStringOptions>): Promise<string> {
    const { url, enka, enableTimeout, allowLocalFile } = bindOptions(defaultFetchStringOptions, options);
    if (allowLocalFile && url.startsWith("file://")) {
        const path = url.slice("file://".length);
        if (!fs.existsSync(path) || !fs.statSync(path).isFile()) throw new Error(`Failed to fetch string from ${url}. File does not exist or is not a file.`);
        return fs.readFileSync(path, "utf-8");
    }

    const headers: JsonObject = { "User-Agent": enka.options.userAgent };
    if (enka.options.githubToken && url.startsWith("https://api.github.com/")) headers["Authorization"] = `Bearer ${enka.options.githubToken}`;

    const requestConfig = {
        headers,
        transformResponse: res => res,
    } as AxiosRequestConfig;
    if (enableTimeout) requestConfig.timeout = enka.options.requestTimeout;

    const res: AxiosResponse = await (async () => {
        try {
            return await axios.get(url, requestConfig);
        } catch (e) {
            if (typeof e === "object" && e && "response" in e) return e.response as AxiosResponse;
            else throw e;
        }
    })();

    if (res.status !== 200) throw new Error(`Failed to fetch string from ${url}. Expected status code 200, but got ${res.status} - ${res.statusText}: ${res.data}`);

    const result = res.data;
    if (typeof result !== "string") throw new Error(`Failed to fetch string from ${url}. Expected a string: ${result}`);
    return res.data as string;
}
