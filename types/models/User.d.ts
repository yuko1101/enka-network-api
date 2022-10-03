export = User;
declare class User {
    /**
     * @param {object} data
     * @param {EnkaClient} enka
     */
    constructor(data: object, enka: EnkaClient);
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {object} */
    _data: object;
    /** @type {string} */
    uid: string;
    /** @type {string} */
    nickname: string;
    /** @type {string | null} */
    signature: string | null;
    /** @type {CharacterData} */
    profilePictureCharacter: CharacterData;
    /** @type {{avatar: CharacterData, level: number, costume?: Costume}[]} */
    showAvatarInfoList: {
        avatar: CharacterData;
        level: number;
        costume?: Costume;
    }[];
    /** @type {NameCard[]} */
    showNameCardList: NameCard[];
    /** @type {number} */
    level: number;
    /** @type {number} */
    worldLevel: number;
    /** @type {NameCard} */
    nameCard: NameCard;
    /** @type {number} */
    finishAchievementNum: number;
    /** @type {number} */
    towerFloorIndex: number;
    /** @type {number} */
    towerLevelIndex: number;
}
import EnkaClient = require("../client/EnkaClient");
import CharacterData = require("./CharacterData");
import Costume = require("./Costume");
import NameCard = require("./NameCard");
