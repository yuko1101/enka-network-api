export = ConfigFile;
/**
 * @en ConfigFile
 */
declare class ConfigFile {
    /**
     * @param {string} filePath
     * @param {*} defaultConfig
     * @param {Array<(string | number)>} route
     * @param {*} storedData
     */
    constructor(filePath: string, defaultConfig: any, route: Array<(string | number)>, storedData: any);
    /** @readonly @type {string} */
    readonly filePath: string;
    /** @readonly @type {*} */
    readonly defaultConfig: any;
    /** @readonly @type {*} */
    readonly data: any;
    /** @readonly @type {Array<(string | number)>} */
    readonly route: Array<(string | number)>;
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
     * @param {Array<(string | number)>} key
     * @returns {ConfigFile}
     */
    get(...key: Array<(string | number)>): ConfigFile;
    /**
     *
     * @param  {Array<(string | number)>} key
     * @returns {boolean}
     */
    has(...key: Array<(string | number)>): boolean;
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
