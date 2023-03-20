export = TextAssets;
/**
 * @en TextAssets
 */
declare class TextAssets {
    /**
     * @param {number} id
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(id: number, enka: import("../../client/EnkaClient"));
    /** @type {number} */
    id: number;
    /** @type {import("../../client/EnkaClient")} */
    enka: import("../../client/EnkaClient");
    /**
     * @param {import("../../client/CachedAssetsManager").LanguageCode} [lang]
     * @returns {string}
     */
    get(lang?: import("../../client/CachedAssetsManager").LanguageCode | undefined): string;
    /**
     * Returns null instead of throwing AssetsNotFoundError.
     * @param {import("../../client/CachedAssetsManager").LanguageCode} [lang]
     * @returns {string | null}
     */
    getNullable(lang?: import("../../client/CachedAssetsManager").LanguageCode | undefined): string | null;
}
