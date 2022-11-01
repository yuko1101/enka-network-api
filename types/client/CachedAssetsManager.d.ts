export = CachedAssetsManager;
/**
 * @exports
 * @module enka-network-api
 */
declare class CachedAssetsManager {
    /**
     * @param {EnkaClient} enka
     */
    constructor(enka: EnkaClient);
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {string} */
    cacheDirectoryPath: string;
    /** @type {number | null} */
    _cacheUpdater: number | null;
    /** @type {ConfigFile | null} */
    _githubCache: ConfigFile | null;
    /** @returns {Promise<void>} */
    cacheDirectorySetup(): Promise<void>;
    /**
     * @param {"chs"|"cht"|"de"|"en"|"es"|"fr"|"id"|"jp"|"kr"|"pt"|"ru"|"th"|"vi"} lang
     */
    fetchLanguageData(lang: "chs" | "cht" | "de" | "en" | "es" | "fr" | "id" | "jp" | "kr" | "pt" | "ru" | "th" | "vi"): Promise<any>;
    /** @returns {Promise<void>} */
    fetchAllContents(): Promise<void>;
    /**
     * @returns {boolean}
     */
    hasAllContents(): boolean;
    /**
     * Returns true if there were any updates, false if there were no updates.
     * @param {object} options
     * @param {() => Promise<*>} [options.onUpdateStart]
     * @param {() => Promise<*>} [options.onUpdateEnd]
     * @returns {Promise<boolean>}
     */
    updateContents(options?: {
        onUpdateStart?: () => Promise<any>;
        onUpdateEnd?: () => Promise<any>;
    }): Promise<boolean>;
    /**
     * @param {object} [options]
     * @param {boolean} [options.instant]
     * @param {number} [options.timeout] in milliseconds
     * @param {() => Promise<*>} [options.onUpdateStart]
     * @param {() => Promise<*>} [options.onUpdateEnd]
     * @returns {void}
     */
    activateAutoCacheUpdater(options?: {
        instant?: boolean;
        timeout?: number;
        onUpdateStart?: () => Promise<any>;
        onUpdateEnd?: () => Promise<any>;
    }): void;
    /** @returns {void} */
    deactivateAutoCacheUpdater(): void;
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
import ConfigFile = require("../utils/ConfigFile");
