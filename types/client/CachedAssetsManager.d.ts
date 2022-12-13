export = CachedAssetsManager;
/**
 * @en CachedAssetsManager
 */
declare class CachedAssetsManager {
    /**
     * @param {EnkaClient} enka
     */
    constructor(enka: EnkaClient);
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {string} */
    defaultCacheDirectoryPath: string;
    /** @type {string} */
    cacheDirectoryPath: string;
    /** @type {number | null} */
    _cacheUpdater: number | null;
    /** @type {ConfigFile | null} */
    _githubCache: ConfigFile | null;
    /** @type {Array<string>} */
    _contentsSrc: Array<string>;
    /** @type {Array<string>} */
    _langs: Array<string>;
    /** @type {boolean} */
    _isFetching: boolean;
    /** @returns {Promise<void>} */
    cacheDirectorySetup(): Promise<void>;
    /**
     * @param {LanguageCode} lang
     * @param {boolean} [store=true]
     */
    fetchLanguageData(lang: LanguageCode, store?: boolean): Promise<any>;
    /**
     * @param {object} options
     * @param {boolean} [options.useRawGenshinData=false]
     * @param {boolean} [options.ghproxy=false] Whether to use ghproxy.com
     * @returns {Promise<void>}
     */
    fetchAllContents(options: {
        useRawGenshinData?: boolean;
        ghproxy?: boolean;
    }): Promise<void>;
    /**
     * @returns {boolean}
     */
    hasAllContents(): boolean;
    /**
     * Returns true if there were any updates, false if there were no updates.
     * @param {object} options
     * @param {boolean} [options.useRawGenshinData=false]
     * @param {boolean} [options.ghproxy=false] Whether to use ghproxy.com
     * @param {function(): Promise<*>} [options.onUpdateStart]
     * @param {function(): Promise<*>} [options.onUpdateEnd]
     * @returns {Promise<boolean>}
     */
    updateContents(options?: {
        useRawGenshinData?: boolean;
        ghproxy?: boolean;
        onUpdateStart?: () => Promise<any>;
        onUpdateEnd?: () => Promise<any>;
    }): Promise<boolean>;
    /**
     * @param {object} [options]
     * @param {boolean} [options.useRawGenshinData=false]
     * @param {boolean} [options.instant=true]
     * @param {boolean} [options.ghproxy=false] Whether to use ghproxy.com
     * @param {number} [options.timeout] in milliseconds
     * @param {function(): Promise<*>} [options.onUpdateStart]
     * @param {function(): Promise<*>} [options.onUpdateEnd]
     * @param {function(Error): Promise<*>} [options.onError]
     * @returns {void}
     */
    activateAutoCacheUpdater(options?: {
        useRawGenshinData?: boolean;
        instant?: boolean;
        ghproxy?: boolean;
        timeout?: number;
        onUpdateStart?: () => Promise<any>;
        onUpdateEnd?: () => Promise<any>;
        onError?: (arg0: Error) => Promise<any>;
    }): void;
    /** @returns {void} */
    deactivateAutoCacheUpdater(): void;
    /**
     * @param {LanguageCode} lang
     * @returns {string}
     */
    getLanguageDataPath(lang: LanguageCode): string;
    /**
     * @param {string} name without extensions (.json)
     * @returns {string}
     */
    getJSONDataPath(name: string): string;
    /**
     * @param {string} name without extensions (.json)
     * @returns {object}
     */
    getGenshinCacheData(name: string): object;
    /**
     * @param {LanguageCode} lang
     * @return {object}
     */
    getLanguageData(lang: LanguageCode): object;
    /**
     * Clean memory of cache data.
     * Then reload data that was loaded before the clean if `reload` is true.
     * If `reload` is false, load each file as needed.
     * @param {boolean} reload
     * @return {void}
     */
    refreshAllData(reload?: boolean): void;
    /**
     * Remove all unused TextHashMaps
     * @param {object} data {AvatarExcelConfigData: [Object object], ManualTextMapConfigData: [Object object], ...}
     * @param {object} langsData {en: [Object object], jp: [Object object], ...}
     */
    removeUnusedTextData(data: object, langsData: object): {};
    /**
     * @param {object} options
     * @param {boolean} [options.ghproxy=false] Whether to use ghproxy.com
     * @returns {Promise<void>}
     */
    _downloadCacheZip(options: {
        ghproxy?: boolean;
    }): Promise<void>;
}
declare namespace CachedAssetsManager {
    export { LanguageCode };
}
import EnkaClient = require("./EnkaClient");
import ConfigFile = require("../utils/ConfigFile");
type LanguageCode = "chs" | "cht" | "de" | "en" | "es" | "fr" | "id" | "jp" | "kr" | "pt" | "ru" | "th" | "vi";
