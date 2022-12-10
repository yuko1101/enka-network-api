export = TextAssets;
/**
 * @en TextAssets
 */
declare class TextAssets {
    /**
     * @param {number} id
     * @param {EnkaClient} enka
     */
    constructor(id: number, enka: EnkaClient);
    /** @type {number} */
    id: number;
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /**
     * @param {import("../../client/CachedAssetsManager").LanguageCode} [lang]
     * @returns {string}
     */
    get(lang?: import("../../client/CachedAssetsManager").LanguageCode): string;
}
import EnkaClient = require("../../client/EnkaClient");
