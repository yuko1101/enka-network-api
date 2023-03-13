// eslint-disable-next-line no-unused-vars
const EnkaClient = require("../../client/EnkaClient");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
// eslint-disable-next-line no-unused-vars
const { LanguageCode } = require("../../client/CachedAssetsManager");

/**
 * @en TextAssets
 */
class TextAssets {

    /**
     * @param {number} id
     * @param {EnkaClient} enka
     */
    constructor(id, enka) {
        /** @type {number} */
        this.id = id;
        /** @type {EnkaClient} */
        this.enka = enka;
    }

    /**
     * @param {LanguageCode} [lang]
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
     * @param {LanguageCode} [lang]
     * @returns {string | null}
     */
    getNullable(lang) {
        try {
            return this.get(lang);
        } catch (e) {
            return null
        }
    }
}

module.exports = TextAssets;
