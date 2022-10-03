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
    /**
     * @param {"data" | "langs"} type
     * @param {"artifact_sets" | "artifacts" | "characters" | "constellations" | "costumes" | "fight_props" | "namecards" | "skills" | "weapons"} category
     * @returns {Promise<object>}
     */
    fetchContent(type: "data" | "langs", category: "artifact_sets" | "artifacts" | "characters" | "constellations" | "costumes" | "fight_props" | "namecards" | "skills" | "weapons"): Promise<object>;
    /**
     * @param {"data" | "langs"} type
     * @param {"artifact_sets" | "artifacts" | "characters" | "constellations" | "costumes" | "fight_props" | "namecards" | "skills" | "weapons"} category
     * @returns {string}
     */
    getAssetsPath(type: "data" | "langs", category: "artifact_sets" | "artifacts" | "characters" | "constellations" | "costumes" | "fight_props" | "namecards" | "skills" | "weapons"): string;
    fetchAllContents(): Promise<void>;
}
import EnkaClient = require("./EnkaClient");
