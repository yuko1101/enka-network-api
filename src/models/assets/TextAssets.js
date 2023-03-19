const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");

/**
 * @en TextAssets
 */
class TextAssets {

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
}

module.exports = TextAssets;
