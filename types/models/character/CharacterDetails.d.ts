export = CharacterDetails;
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
declare class CharacterDetails {
    /**
     * @param {number} id
     * @param {import("../../client/EnkaClient")} enka
     * @param {number} [characterId]
     * @param {boolean} [isArchon]
     */
    constructor(id: number, enka: import("../../client/EnkaClient"), characterId?: number | undefined, isArchon?: boolean | undefined);
    /** @type {import("../../client/EnkaClient")} */
    enka: import("../../client/EnkaClient");
    /** @type {Object<string, any>} */
    _data: {
        [x: string]: any;
    };
    /** @type {number} */
    id: number;
    /**
     * If the character is Traveler, this will be null.
     * @type {Birthday | null}
     */
    birthday: Birthday | null;
    /** @type {TextAssets} */
    location: TextAssets;
    /** @type {TextAssets} */
    vision: TextAssets;
    /** @type {TextAssets} */
    constellation: TextAssets;
    /** @type {TextAssets} */
    title: TextAssets;
    /** @type {TextAssets} */
    description: TextAssets;
    /** @type {CharacterVoices} */
    cv: CharacterVoices;
    /**
     * @param {import("../../client/CachedAssetsManager").LanguageCode} [lang]
     * @returns {TextAssets}
     */
    getCvByLanguage(lang?: import("../../client/CachedAssetsManager").LanguageCode | undefined): TextAssets;
}
declare namespace CharacterDetails {
    export { Birthday, CharacterVoices };
}
type Birthday = {
    month: number;
    day: number;
};
import TextAssets = require("../assets/TextAssets");
type CharacterVoices = {
    chinese: TextAssets;
    japanese: TextAssets;
    english: TextAssets;
    korean: TextAssets;
};
