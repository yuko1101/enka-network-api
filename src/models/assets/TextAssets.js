const EnkaClient = require("../../client/EnkaClient");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");

module.exports = class TextAssets {
    /** 
     * @param {"artifact_sets" | "artifacts" | "characters" | "constellations" | "costumes" | "fight_props" | "namecards" | "skills" | "weapons"} category
     * @param {string} id
     * @param {EnkaClient} enka
     */
    constructor(category, id, enka) {
        /** @type {"artifact_sets" | "artifacts" | "characters" | "constellations" | "costumes" | "fight_props" | "namecards" | "skills" | "weapons"} */
        this.category = category;
        /** @type {string} */
        this.id = id;
        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {object} */
        this._data = require(enka.cachedAssetsManager.getAssetsPath("langs", category))[id];

        if (!this._data) throw new AssetsNotFoundError(`TextData of ${category}`, id);
    }

    /** 
     * @param {"chs"|"cht"|"de"|"en"|"es"|"fr"|"id"|"jp"|"kr"|"pt"|"ru"|"th"|"vi"} lang
     * @returns {string}
     */
    get(lang) {
        return this._data[lang.toUpperCase()];
    }
}