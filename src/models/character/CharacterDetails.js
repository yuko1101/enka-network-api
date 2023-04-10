const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const ImageAssets = require("../assets/ImageAssets");
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
     * @param {number | null} id
     * @param {import("../../client/EnkaClient")} enka
     * @param {number} [characterId]
     * @param {boolean} [isArchon]
     */
    constructor(id, enka, characterId = null, isArchon = false) {
        if (!id && !characterId) throw new Error("An id or character id must be provided.");

        /** @type {import("../../client/EnkaClient")} */
        this.enka = enka;

        /** @type {Object<string, any>} */
        this._data = enka.cachedAssetsManager.getGenshinCacheData("FetterInfoExcelConfigData").find(f => (id && f.fetterId === id) || f.avatarId === characterId);
        if (!this._data) throw new AssetsNotFoundError("FetterInfo", `${characterId}-${id}`);

        /** @type {string} */
        this._nameId = require("../../utils/character_utils").getNameIdByCharacterId(this._data.avatarId, enka);

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
        this.constellation = new TextAssets(isArchon ? this._data.avatarConstellationAfterTextMapHash : this._data.avatarConstellationBeforTextMapHash, enka);

        /** @type {ImageAssets} */
        this.constellationIcon = new ImageAssets(`Eff_UI_Talent_${this._nameId}`, enka);

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
     * @param {import("../../client/CachedAssetsManager").LanguageCode} [lang]
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