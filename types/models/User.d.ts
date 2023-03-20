export = User;
/**
 * @en User
 */
declare class User {
    /**
     * @param {Object<string, any>} data
     * @param {import("../client/EnkaClient")} enka
     * @param {number | string} [uid] For players who do not have uid in multiplayer profile (who do not have unlocked multiplayer yet).
     */
    constructor(data: {
        [x: string]: any;
    }, enka: import("../client/EnkaClient"), uid?: string | number | undefined);
    /** @type {import("../client/EnkaClient")} */
    enka: import("../client/EnkaClient");
    /** @type {Object<string, any>} */
    _data: {
        [x: string]: any;
    };
    /** @type {number} */
    uid: number;
    /** @type {string | null} */
    nickname: string | null;
    /** @type {string | null} */
    signature: string | null;
    /** @type {CharacterData | null} */
    profilePictureCharacter: CharacterData | null;
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
    /** @type {number} */
    ttl: number;
    /** @type {EnkaProfile | null} */
    enkaProfile: EnkaProfile | null;
    /** @type {string | null} */
    enkaUserHash: string | null;
    /** @type {string} */
    url: string;
}
import CharacterData = require("./character/CharacterData");
import Costume = require("./character/Costume");
import NameCard = require("./material/NameCard");
import EnkaProfile = require("./enka/EnkaProfile");
