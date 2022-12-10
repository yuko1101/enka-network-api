const EnkaClient = require("../../client/EnkaClient");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
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
        const text = require(this.enka.cachedAssetsManager.getLanguageDataPath(lang))[this.id];
        if (!text) throw new AssetsNotFoundError("Text Assets", this.id);
        return text;
    }
}

module.exports = TextAssets;