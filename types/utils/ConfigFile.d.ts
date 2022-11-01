export = ConfigFile;
/**
 * @exports
 * @module enka-network-api
 */
declare class ConfigFile {
    /**
     * @param {string} filePath
     * @param {*} defaultConfig
     * @param {(string | number)[]} route
     * @param {*} storedData
     */
    constructor(filePath: string, defaultConfig: any, route: (string | number)[], storedData: any);
    /** @readonly @type {string} */
    readonly filePath: string;
    /** @readonly @type {*} */
    readonly defaultConfig: any;
    /** @readonly @type {*} */
    readonly data: any;
    /** @readonly @type {(string | number)[]} */
    readonly route: (string | number)[];
    /**
     * @param {boolean} [compact=false]
     * @returns {Promise<ConfigFile>}
     */
    save(compact?: boolean): Promise<ConfigFile>;
    /**
     * @returns {Promise<ConfigFile>}
     */
    load(): Promise<ConfigFile>;
    /**
     * @param {string | number} key
     * @param {*} value
     * @returns {ConfigFile}
     */
    set(key: string | number, value: any): ConfigFile;
    /**
     * @param {*} value
     * @returns {ConfigFile}
     */
    add(value: any): ConfigFile;
    /**
     * @param {string | number} key
     * @returns {*}
     */
    getValue(key?: string | number): any;
    /**
     * @param {(string | number)[]} key
     * @returns {ConfigFile}
     */
    get(...key: (string | number)[]): ConfigFile;
    /**
     *
     * @param  {(string | number)[]} key
     * @returns {boolean}
     */
    has(...key: (string | number)[]): boolean;
    /**
     * @returns {boolean}
     */
    exists(): boolean;
    /**
     * @returns {ConfigFile}
     */
    resetData(): ConfigFile;
    /**
     * @returns {ConfigFile}
     */
    resetPath(): ConfigFile;
    /**
     * @private
     */
    private getCurrentRouteObject;
    /**
     * @private
     */
    private getParentRouteObject;
}
