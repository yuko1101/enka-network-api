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
     * @param {LanguageCode} [lang]
     * @returns {string}
     */
    get(lang?: LanguageCode): string;
}
import EnkaClient = require("../../client/EnkaClient");
import { LanguageCode } from "../../client/CachedAssetsManager";
