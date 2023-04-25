import AssetsNotFoundError from "../../errors/AssetsNotFoundError";

/**
 * @en TextAssets
 */
export default class TextAssets {

    /**
     * @param {number} id
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(id, enka) {
        /** @type {number} */
        this.id = id;
        /** @type {import("../../client/EnkaClient")} */
        this.enka = enka;
    }

    /**
     * @param {import("../../client/CachedAssetsManager").LanguageCode} [lang]
     * @returns {string}
     */
    get(lang) {
        lang ??= this.enka.options.defaultLanguage;
        const text = this.enka.cachedAssetsManager.getLanguageData(lang)[this.id];
        if (!text) throw new AssetsNotFoundError("Text Assets", this.id);
        return text;
    }

    /**
     * Returns null instead of throwing AssetsNotFoundError.
     * @param {import("../../client/CachedAssetsManager").LanguageCode} [lang]
     * @returns {string | null}
     */
    getNullable(lang) {
        try {
            return this.get(lang);
        } catch (e) {
            return null;
        }
    }

    /**
     * Returns whether the text is formatted or not.
     * @param {import("../../client/CachedAssetsManager").LanguageCode} [lang]
     * @returns {boolean}
     */
    isFormatted(lang) {
        const text = this.getNullable(lang);
        return isTextFormatted(text);
    }

    /**
     * @param {import("../../client/CachedAssetsManager").LanguageCode} [lang]
     * @returns {FormattedText}
     */
    getAsFormattedText(lang) {
        const text = this.get(lang);
        return new FormattedText(text.replace(/^#/, ""), text.startsWith("#"));
    }

    /**
     * Returns null instead of throwing AssetsNotFoundError.
     * @param {import("../../client/CachedAssetsManager").LanguageCode} [lang]
     * @returns {FormattedText | null}
     */
    getAsNullableFormattedText(lang) {
        try {
            return this.getAsFormattedText(lang);
        } catch (e) {
            return null;
        }
    }

    /**
     * @returns {string}
     */
    toString() {
        return this.getNullable() ?? `Unknown TextAssets(${this.id})`;
    }
}

function isTextFormatted(text) {
    return text?.startsWith("#") || /<.+>/.test(text);
}

function hasTextPlaceholder(text) {
    return /\{([^#]+)#([^}]+)\}/.test(text);
}

class FormattedText {
    /**
     * @param {string} text
     * @param {boolean} formattedWithPlaceholder
     */
    constructor(text, formattedWithPlaceholder) {
        /**
         * @readonly
         * @type {string}
         */
        this.text = text;

        /**
         * @readonly
         * @type {boolean}
         */
        this.formattedWithPlaceholder = formattedWithPlaceholder;
    }

    hasPlaceholder() {
        return this.formattedWithPlaceholder && hasTextPlaceholder(this.text);
    }

    /**
     * @param {Object<string, boolean>} placeholderMap
     * @returns {FormattedText}
     */
    replacePlaceholder(placeholderMap) {
        if (!this.hasPlaceholder()) return new FormattedText(this.text, this.formattedWithPlaceholder);

        const replaced = this.text.replace(/\{([^#]+)#([^}]+)\}/g, (_, $1, $2) => placeholderMap[$1] ? $2 : "");
        return new FormattedText(replaced, this.formattedWithPlaceholder);
    }

    /**
     * Make colors and other formatting work in HTML.
     * @returns {FormattedText}
     */
    replaceHTML() {
        const replaced = this.text
            .replace(/<color=([^>]+)>/g, "<span style=\"color:$1\">")
            .replace(/<\/color>/g, "</span>")

            .replace(/\r\n|\n|\\n|\r/gm, "<br>");

        return new FormattedText(replaced, this.formattedWithPlaceholder);
    }
}