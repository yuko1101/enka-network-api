// eslint-disable-next-line no-unused-vars
const EnkaClient = require("../../client/EnkaClient");
// eslint-disable-next-line no-unused-vars
const { LanguageCode } = require("../../client/CachedAssetsManager");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const TextAssets = require("../assets/TextAssets");

/**
 * @en Birthday
 * @typedef Birthday
 * @type {object}
 * @property {number} month
 * @property {number} day
 */

/**
 * @en CharacterVoices
 * @typedef CharacterVoices
 * @type {object}
 * @property {TextAssets} chinese
 * @property {TextAssets} japanese
 * @property {TextAssets} english
 * @property {TextAssets} korean
 */

/**
 * @en CharacterDetails
 */
class CharacterDetails {
    /**
     * @param {number} id
     * @param {EnkaClient} enka
     * @param {number} [characterId]
     */
    constructor(id, enka, characterId = null) {
        if (!id && !characterId) throw new Error("An id or character id must be provided.");

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {object} */
        this._data = enka.cachedAssetsManager.getGenshinCacheData("FetterInfoExcelConfigData").find(f => (id && f.fetterId === id) || f.avatarId === characterId);
        if (!this._data) throw new AssetsNotFoundError("FetterInfo", `${characterId}-${id}`);

        /** @type {number} */
        this.id = id ?? this._data.fetterId;

        /**
         * If the character is Traveler, this will be null.
         * @type {Birthday | null}
         */
        this.birthday = (this._data.infoBirthMonth && this._data.infoBirthDay) ? { month: this._data.infoBirthMonth, day: this._data.infoBirthDay } : null;

        /** @type {TextAssets} */
        this.location = new TextAssets(this._data.avatarNativeTextMapHash, enka);

        /** @type {TextAssets} */
        this.vision = new TextAssets(this._data.avatarVisionBeforTextMapHash, enka);

        /** @type {TextAssets} */
        this.constellation = new TextAssets(this._data.avatarConstellationBeforTextMapHash, enka);

        /** @type {TextAssets} */
        this.title = new TextAssets(this._data.avatarTitleTextMapHash, enka);

        /** @type {TextAssets} */
        this.description = new TextAssets(this._data.avatarDetailTextMapHash, enka);

        /** @type {CharacterVoices} */
        this.cv = {
            chinese: new TextAssets(this._data.cvChineseTextMapHash, enka),
            japanese: new TextAssets(this._data.cvJapaneseTextMapHash, enka),
            english: new TextAssets(this._data.cvEnglishTextMapHash, enka),
            korean: new TextAssets(this._data.cvKoreanTextMapHash, enka),
        };
    }

    /**
     * @param {LanguageCode} [lang]
     * @returns {TextAssets}
     */
    getCvByLanguage(lang) {
        lang ??= this.enka.options.defaultLanguage;
        switch (lang) {
            case "chs":
            case "cht":
                return this.cv.chinese;
            case "jp":
                return this.cv.japanese;
            case "kr":
                return this.cv.korean;
            default:
                return this.cv.english;
        }
    }
}

module.exports = CharacterDetails;