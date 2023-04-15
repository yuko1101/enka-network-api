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
    /**
     * Returns whether the text is formatted or not.
     * @param {import("../../client/CachedAssetsManager").LanguageCode} [lang]
     * @returns {boolean}
     */
    isFormatted(lang?: import("../../client/CachedAssetsManager").LanguageCode | undefined): boolean;
    /**
     * @param {import("../../client/CachedAssetsManager").LanguageCode} [lang]
     * @returns {FormattedText}
     */
    getAsFormattedText(lang?: import("../../client/CachedAssetsManager").LanguageCode | undefined): FormattedText;
    /**
     * Returns null instead of throwing AssetsNotFoundError.
     * @param {import("../../client/CachedAssetsManager").LanguageCode} [lang]
     * @returns {FormattedText | null}
     */
    getAsNullableFormattedText(lang?: import("../../client/CachedAssetsManager").LanguageCode | undefined): FormattedText | null;
    /**
     * @returns {string}
     */
    toString(): string;
}
declare class FormattedText {
    /**
     * @param {string} text
     * @param {boolean} formattedWithPlaceholder
     */
    constructor(text: string, formattedWithPlaceholder: boolean);
    /**
     * @readonly
     * @type {string}
     */
    readonly text: string;
    /**
     * @readonly
     * @type {boolean}
     */
    readonly formattedWithPlaceholder: boolean;
    hasPlaceholder(): boolean;
    /**
     * @param {Object<string, boolean>} placeholderMap
     * @returns {FormattedText}
     */
    replacePlaceholder(placeholderMap: {
        [x: string]: boolean;
    }): FormattedText;
    /**
     * Make colors and other formatting work in HTML.
     * @returns {FormattedText}
     */
    replaceHTML(): FormattedText;
}
