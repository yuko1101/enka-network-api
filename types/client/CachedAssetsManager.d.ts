export = CachedAssetsManager;
declare class CachedAssetsManager {
    /**
     * @param {EnkaClient} enka
     */
    constructor(enka: EnkaClient);
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {string} */
    cacheDirectoryPath: string;
    /** @returns {void} */
    cacheDirectorySetup(): void;
    /**
     * @param {"chs"|"cht"|"de"|"en"|"es"|"fr"|"id"|"jp"|"kr"|"pt"|"ru"|"th"|"vi"} lang
     */
    fetchLanguageData(lang: "chs" | "cht" | "de" | "en" | "es" | "fr" | "id" | "jp" | "kr" | "pt" | "ru" | "th" | "vi"): Promise<any>;
    fetchAllContents(): Promise<void>;
    /**
     * @returns {boolean}
     */
    hasAllContents(): boolean;
    /**
     * @param {"chs"|"cht"|"de"|"en"|"es"|"fr"|"id"|"jp"|"kr"|"pt"|"ru"|"th"|"vi"} lang
     * @returns {string}
     */
    getLanguageDataPath(lang: "chs" | "cht" | "de" | "en" | "es" | "fr" | "id" | "jp" | "kr" | "pt" | "ru" | "th" | "vi"): string;
    /**
     * @param {string} name without extensions (.json)
     * @returns {string}
     */
    getJSONDataPath(name: string): string;
}
import EnkaClient = require("./EnkaClient");
