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
     * @param {EnkaClient} enka
     * @param {number} [characterId]
     */
    constructor(id: number, enka: EnkaClient, characterId?: number);
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {object} */
    _data: object;
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
     * @param {LanguageCode} [lang]
     * @returns {TextAssets}
     */
    getCvByLanguage(lang?: LanguageCode): TextAssets;
}
declare namespace CharacterDetails {
    export { Birthday, CharacterVoices };
}
import EnkaClient = require("../../client/EnkaClient");
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
import { LanguageCode } from "../../client/CachedAssetsManager";
