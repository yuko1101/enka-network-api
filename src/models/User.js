const EnkaClient = require("../client/EnkaClient");
const Character = require("./character/Character");
const CharacterData = require("./character/CharacterData");
const Costume = require("./Costume");
const NameCard = require("./NameCard");

module.exports = class User {
    /** 
     * @param {object} data
     * @param {EnkaClient} enka
     */
    constructor(data, enka) {
        /** @type {EnkaClient} */
        this.enka = enka;


        /** @type {object} */
        this._data = data;

        /** @type {string} */
        this.uid = data.uid;

        /** @type {string} */
        this.nickname = data.playerInfo.nickname;

        /** @type {string | null} */
        this.signature = data.playerInfo.signature ?? null;

        /** @type {CharacterData} */
        this.profilePictureCharacter = new CharacterData(data.playerInfo.profilePicture.avatarId, enka);

        /** @type {{avatar: CharacterData, level: number, costume?: Costume}[]} */
        this.showAvatarInfoList = data.playerInfo.showAvatarInfoList ? data.playerInfo.showAvatarInfoList.map(obj => {
            const character = new CharacterData(obj.avatarId, enka);
            delete obj["avatarId"];

            if (obj["costumeId"]) {
                const costume = new Costume(obj["costumeId"], enka);
                obj["costume"] = costume;
                delete obj["costumeId"];
            }

            return {
                ...obj,
                avatar: character,
            };
        }) : [];

        /** @type {NameCard[]} */
        this.showNameCardList = data.playerInfo.showNameCardIdList ? data.playerInfo.showNameCardIdList.map(id => new NameCard(id, enka)) : [];

        /** @type {number} */
        this.level = data.playerInfo.level;

        /** @type {number} */
        this.worldLevel = data.playerInfo.worldLevel;

        /** @type {NameCard} */
        this.nameCard = new NameCard(data.playerInfo.nameCardId, enka);

        /** @type {number} */
        this.finishAchievementNum = data.playerInfo.finishAchievementNum;

        /** @type {number} */
        this.towerFloorIndex = data.playerInfo.towerFloorIndex;

        /** @type {number} */
        this.towerLevelIndex = data.playerInfo.towerLevelIndex;


        /** @type {Character[]} */
        this.avatarInfoList = data.avatarInfoList.map(a => new Character(a, enka));
    }
}