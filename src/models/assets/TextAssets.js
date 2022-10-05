const EnkaClient = require("../../client/EnkaClient");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");

module.exports = class TextAssets {
    /** 
     * @param {number | string} id
     * @param {EnkaClient} enka
     */
    constructor(id, enka) {
        if (typeof id === "string") throw new Error("testassets " + id);
        /** @type {number} */
        this.id = id;
        /** @type {EnkaClient} */
        this.enka = enka;
    }

    /** 
     * @param {"chs"|"cht"|"de"|"en"|"es"|"fr"|"id"|"jp"|"kr"|"pt"|"ru"|"th"|"vi"} [lang]
     * @returns {string}
     */
    get(lang) {
        if (!lang) lang = this.enka.options.defaultLanguage;
        const text = require(this.enka.cachedAssetsManager.getLanguageDataPath(lang))[this.id];
        if (!text) throw new AssetsNotFoundError("Text Assets", this.id);
        return text;
    }
}