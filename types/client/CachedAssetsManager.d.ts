export = CachedAssetsManager;
/**
 * @en CachedAssetsManager
 */
declare class CachedAssetsManager {
    /**
     * @param {import("./EnkaClient")} enka
     */
    constructor(enka: import("./EnkaClient"));
    /** @type {import("./EnkaClient")} */
    enka: import("./EnkaClient");
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
    fetchLanguageData(lang: LanguageCode, store?: boolean | undefined): Promise<any>;
    /**
     * Whether the game data update is available or not.
     * @param {boolean} [useRawGenshinData=false] Whether to fetch from gitlab repo ({@link https://gitlab.com/Dimbreath/AnimeGameData}) instead of downloading cache.zip
     * @returns {Promise<boolean>}
     */
    checkForUpdates(useRawGenshinData?: boolean | undefined): Promise<boolean>;
    /**
     * @param {object} options
     * @param {boolean} [options.useRawGenshinData=false] Whether to fetch from gitlab repo ({@link https://gitlab.com/Dimbreath/AnimeGameData}) instead of downloading cache.zip
     * @param {boolean} [options.ghproxy=false] Whether to use ghproxy.com
     * @returns {Promise<void>}
     */
    fetchAllContents(options: {
        useRawGenshinData?: boolean | undefined;
        ghproxy?: boolean | undefined;
    }): Promise<void>;
    /**
     * @returns {boolean}
     */
    hasAllContents(): boolean;
    /**
     * Returns true if there were any updates, false if there were no updates.
     * @param {object} options
     * @param {boolean} [options.useRawGenshinData=false] Whether to fetch from gitlab repo ({@link https://gitlab.com/Dimbreath/AnimeGameData}) instead of downloading cache.zip
     * @param {boolean} [options.ghproxy=false] Whether to use ghproxy.com
     * @param {function(): Promise<*>} [options.onUpdateStart]
     * @param {function(): Promise<*>} [options.onUpdateEnd]
     * @returns {Promise<boolean>}
     */
    updateContents(options?: {
        useRawGenshinData?: boolean | undefined;
        ghproxy?: boolean | undefined;
        onUpdateStart?: (() => Promise<any>) | undefined;
        onUpdateEnd?: (() => Promise<any>) | undefined;
    }): Promise<boolean>;
    /**
     * @param {object} [options]
     * @param {boolean} [options.useRawGenshinData=false] Whether to fetch from gitlab repo ({@link https://gitlab.com/Dimbreath/AnimeGameData}) instead of downloading cache.zip
     * @param {boolean} [options.instant=true]
     * @param {boolean} [options.ghproxy=false] Whether to use ghproxy.com
     * @param {number} [options.timeout] in milliseconds
     * @param {function(): Promise<*>} [options.onUpdateStart]
     * @param {function(): Promise<*>} [options.onUpdateEnd]
     * @param {function(Error): Promise<*>} [options.onError]
     * @returns {void}
     */
    activateAutoCacheUpdater(options?: {
        useRawGenshinData?: boolean | undefined;
        instant?: boolean | undefined;
        ghproxy?: boolean | undefined;
        timeout?: number | undefined;
        onUpdateStart?: (() => Promise<any>) | undefined;
        onUpdateEnd?: (() => Promise<any>) | undefined;
        onError?: ((arg0: Error) => Promise<any>) | undefined;
    } | undefined): void;
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
     * @returns {object | Array<any>}
     */
    getGenshinCacheData(name: string): object | Array<any>;
    /**
     * @param {LanguageCode} lang
     * @return {Object<string, string>}
     */
    getLanguageData(lang: LanguageCode): {
        [x: string]: string;
    };
    /** @returns {ObjectKeysManager} */
    getObjectKeysManager(): ObjectKeysManager;
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
     * @param {Object<string, Object<string, any>>} data {AvatarExcelConfigData: [Object object], ManualTextMapConfigData: [Object object], ...}
     * @param {Object<LanguageCode, Object<string, string>>} langsData {en: [Object object], jp: [Object object], ...}
     * @param {boolean} [showLog=true]
     */
    removeUnusedTextData(data: {
        [x: string]: {
            [x: string]: any;
        };
    }, langsData: any, showLog?: boolean | undefined): {};
    /**
     * @param {object} options
     * @param {boolean} [options.ghproxy=false] Whether to use ghproxy.com
     * @returns {Promise<void>}
     */
    _downloadCacheZip(options: {
        ghproxy?: boolean | undefined;
    }): Promise<void>;
}
declare namespace CachedAssetsManager {
    export { LanguageCode };
}
import ConfigFile = require("../utils/ConfigFile");
type LanguageCode = "chs" | "cht" | "de" | "en" | "es" | "fr" | "id" | "jp" | "kr" | "pt" | "ru" | "th" | "vi";
import ObjectKeysManager = require("./ObjectKeysManager");
