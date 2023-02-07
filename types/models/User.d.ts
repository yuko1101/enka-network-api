export = User;
/**
 * @en User
 */
declare class User {
    /**
     * @param {object} data
     * @param {EnkaClient} enka
     * @param {boolean} parse
     * @param {number | string} [uid] For players who do not have uid in multiplayer profile (who do not have unlocked multiplayer yet).
     */
    constructor(data: object, enka: EnkaClient, parse?: boolean, uid?: number | string);
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
    /** @type {Array<{characterData: CharacterData, level: number, costume: Costume | null}>} */
    charactersPreview: {
        characterData: CharacterData;
        level: number;
        costume: Costume | null;
    }[];
    /** @type {Array<NameCard>} */
    nameCards: Array<NameCard>;
    /** @type {number} */
    level: number;
    /** @type {number} */
    worldLevel: number;
    /** @type {NameCard} */
    profileCard: NameCard;
    /** @type {number} */
    achievements: number;
    /** @type {number | null} */
    abyssFloor: number | null;
    /** @type {number | null} */
    abyssChamber: number | null;
    /** @type {boolean} */
    showCharacterDetails: boolean;
    /** @type {Array<Character>} */
    characters: Array<Character>;
}
import EnkaClient = require("../client/EnkaClient");
import CharacterData = require("./character/CharacterData");
import Costume = require("./character/Costume");
import NameCard = require("./NameCard");
import Character = require("./character/Character");
