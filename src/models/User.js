// eslint-disable-next-line no-unused-vars
const EnkaClient = require("../client/EnkaClient");
const Character = require("./character/Character");
const CharacterData = require("./character/CharacterData");
const Costume = require("./character/Costume");
const NameCard = require("./NameCard");

/**
 * @en User
 */
class User {

    /**
     * @param {object} data
     * @param {EnkaClient} enka
     * @param {boolean} parse
     * @param {number | string} [uid] For players who do not have uid in multiplayer profile (who do not have unlocked multiplayer yet).
     */
    constructor(data, enka, parse = true, uid = null) {
        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {object} */
        this._data = data;

        if (!parse) return;
        if (!enka.cachedAssetsManager.hasAllContents()) throw new Error("Complete Genshin data cache not found.\nYou need to fetch Genshin data by EnkaClient#cachedAssetsManager#fetchAllContents.");

        /** @type {number} */
        this.uid = isNaN(Number(data.uid)) && uid ? Number(uid) : Number(data.uid);

        /** @type {string} */
        this.nickname = data.playerInfo.nickname;

        /** @type {string | null} */
        this.signature = data.playerInfo.signature ?? null;

        /** @type {CharacterData} */
        this.profilePictureCharacter = new CharacterData(data.playerInfo.profilePicture.avatarId, enka);

        /** @type {Array<{characterData: CharacterData, level: number, costume: Costume | null}>} */
        this.charactersPreview = data.playerInfo.showAvatarInfoList ? data.playerInfo.showAvatarInfoList.map(obj => {
            const copyObj = {
                ...obj,
            };
            const character = new CharacterData(copyObj.avatarId, enka);
            copyObj["characterData"] = character;
            delete copyObj["avatarId"];

            if (copyObj["costumeId"]) {
                const costume = new Costume(copyObj["costumeId"], enka);
                copyObj["costume"] = costume;
                delete copyObj["costumeId"];
            }

            return copyObj;
        }) : [];

        /** @type {Array<NameCard>} */
        this.nameCards = data.playerInfo.showNameCardIdList ? data.playerInfo.showNameCardIdList.map(id => new NameCard(id, enka)) : [];

        /** @type {number} */
        this.level = data.playerInfo.level;

        /** @type {number} */
        this.worldLevel = data.playerInfo.worldLevel;

        /** @type {NameCard} */
        this.profileCard = new NameCard(data.playerInfo.nameCardId, enka);

        /** @type {number} */
        this.achievements = data.playerInfo.finishAchievementNum ?? 0;

        /** @type {number} */
        this.abyssFloor = data.playerInfo.towerFloorIndex;

        /** @type {number} */
        this.abyssChamber = data.playerInfo.towerLevelIndex;

        /** @type {boolean} */
        this.showCharacterDetails = !!data.avatarInfoList;

        /** @type {Array<Character>} */
        this.characters = data.avatarInfoList?.map(a => new Character(a, enka)) ?? [];
    }
}

module.exports = User;
