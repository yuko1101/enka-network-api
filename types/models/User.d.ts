export = User;
/**
 * @exports
 * @module enka-network-api
 */
declare class User {
    /**
     * @param {object} data
     * @param {boolean} parse
     * @param {EnkaClient} enka
     */
    constructor(data: object, parse: boolean, enka: EnkaClient);
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {object} */
    _data: object;
    /** @type {number} */
    uid: number;
    /** @type {string} */
    nickname: string;
    /** @type {string | null} */
    signature: string | null;
    /** @type {CharacterData} */
    profilePictureCharacter: CharacterData;
    /** @type {{characterData: CharacterData, level: number, costume?: Costume}[]} */
    charactersPreview: {
        characterData: CharacterData;
        level: number;
        costume?: Costume;
    }[];
    /** @type {NameCard[]} */
    nameCards: NameCard[];
    /** @type {number} */
    level: number;
    /** @type {number} */
    worldLevel: number;
    /** @type {NameCard} */
    profileCard: NameCard;
    /** @type {number} */
    achievements: number;
    /** @type {number} */
    abyssFloor: number;
    /** @type {number} */
    abyssChamber: number;
    /** @type {Character[]} */
    characters: Character[];
}
import EnkaClient = require("../client/EnkaClient");
import CharacterData = require("./character/CharacterData");
import Costume = require("./character/Costume");
import NameCard = require("./NameCard");
import Character = require("./character/Character");
