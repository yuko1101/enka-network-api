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
    get(lang?: LanguageCode | undefined): string;
    /**
     * Returns null instead of throwing AssetsNotFoundError.
     * @param {LanguageCode} [lang]
     * @returns {string | null}
     */
    getNullable(lang?: LanguageCode | undefined): string | null;
}
import EnkaClient = require("../../client/EnkaClient");
import { LanguageCode } from "../../client/CachedAssetsManager";
