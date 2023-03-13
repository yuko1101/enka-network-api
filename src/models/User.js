// eslint-disable-next-line no-unused-vars
const EnkaClient = require("../client/EnkaClient");
const CharacterData = require("./character/CharacterData");
const Costume = require("./character/Costume");
const EnkaProfile = require("./enka/EnkaProfile");
const NameCard = require("./NameCard");

/**
 * @en User
 */
class User {

    /**
     * @param {Object<string, any>} data
     * @param {EnkaClient} enka
     * @param {number | string} [uid] For players who do not have uid in multiplayer profile (who do not have unlocked multiplayer yet).
     */
    constructor(data, enka, uid = null) {
        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {Object<string, any>} */
        this._data = data;

        if (!enka.cachedAssetsManager.hasAllContents()) throw new Error("Complete Genshin data cache not found.\nYou need to fetch Genshin data by EnkaClient#cachedAssetsManager#fetchAllContents.");

        /** @type {number} */
        this.uid = isNaN(Number(data.uid)) && uid ? Number(uid) : Number(data.uid);

        /** @type {string | null} */
        this.nickname = data.playerInfo.nickname ?? null;

        /** @type {string | null} */
        this.signature = data.playerInfo.signature ?? null;

        /** @type {CharacterData | null} */
        this.profilePictureCharacter = data.playerInfo.profilePicture.avatarId ? new CharacterData(data.playerInfo.profilePicture.avatarId, enka) : null;

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
        this.worldLevel = data.playerInfo.worldLevel ?? 0;

        /** @type {NameCard} */
        this.profileCard = new NameCard(data.playerInfo.nameCardId, enka);

        /** @type {number} */
        this.achievements = data.playerInfo.finishAchievementNum ?? 0;

        /** @type {number | null} */
        this.abyssFloor = data.playerInfo.towerFloorIndex ?? null;

        /** @type {number | null} */
        this.abyssChamber = data.playerInfo.towerLevelIndex ?? null;

        /** @type {number} */
        this.ttl = data.ttl;

        /** @type {EnkaProfile | null} */
        this.enkaProfile = data.owner ? new EnkaProfile(data.owner, enka) : null;

        /** @type {string | null} */
        this.enkaUserHash = data.owner?.hash ?? null;

        /** @type {string} */
        this.url = `${enka.options.enkaUrl}/u/${this.uid}`;
    }
}

module.exports = User;