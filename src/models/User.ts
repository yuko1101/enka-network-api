import { JsonObject } from "config_file.js";
import CharacterData from "./character/CharacterData";
import Costume from "./character/Costume";
import EnkaProfile from "./enka/EnkaProfile";
import NameCard from "./material/NameCard";
import EnkaClient from "../client/EnkaClient";

export type CharacterPreview = { characterData: CharacterData, level: number, costume: Costume };

/**
 * @en User
 */
export default class User {
    enka: EnkaClient;
    _data: JsonObject;
    uid: number;
    nickname: string | null;
    signature: string | null;
    profilePictureCharacter: CharacterData | null;
    charactersPreview: CharacterPreview[];
    nameCards: NameCard[];
    level: number;
    worldLevel: number;
    profileCard: NameCard;
    achievements: number;
    spiralAbyss: {
        floor: number,
        chamber: number,
    } | null;
    ttl: number;
    enkaProfile: EnkaProfile | null;
    enkaUserHash: string | null;
    url: string;

    /**
     * @param {Object<string, any>} data
     * @param {import("../client/EnkaClient")} enka
     * @param uid For players who do not have uid in multiplayer profile (who do not have unlocked multiplayer yet).
     */
    constructor(data: JsonObject, enka: EnkaClient, uid?: number | string) {
        /** @type {import("../client/EnkaClient")} */
        this.enka = enka;

        /** @type {Object<string, any>} */
        this._data = data;

        if (!enka.cachedAssetsManager.hasAllContents()) throw new Error("Complete Genshin data cache not found.\nYou need to fetch Genshin data by EnkaClient#cachedAssetsManager#fetchAllContents.");

        /** @type {number} */
        this.uid = isNaN(Number(data.uid)) && uid ? Number(uid) : Number(data.uid);

        const playerInfo = data.playerInfo as JsonObject | undefined;

        /** @type {string | null} */
        this.nickname = (playerInfo?.nickname ?? null) as string | null;

        /** @type {string | null} */
        this.signature = (playerInfo?.signature ?? null) as string | null;

        const profilePicture = playerInfo?.profilePicture as JsonObject | undefined;
        /** @type {CharacterData | null} */
        this.profilePictureCharacter = profilePicture?.avatarId ? new CharacterData(profilePicture.avatarId as number, enka) : null;

        /** @type {Array<{characterData: CharacterData, level: number, costume: Costume | null}>} */
        this.charactersPreview = playerInfo?.showAvatarInfoList ? (playerInfo.showAvatarInfoList as JsonObject[]).map(obj => {
            const characterData = new CharacterData(obj.avatarId as number, enka);

            const costume = obj["costumeId"] ? new Costume(obj["costumeId"] as number, enka) : (characterData.costumes.find(c => c.isDefault) as Costume);

            const preview: CharacterPreview = {
                characterData,
                level: obj.level as number,
                costume,
            };

            return preview;
        }) : [];

        /** @type {Array<NameCard>} */
        this.nameCards = playerInfo.showNameCardIdList ? playerInfo.showNameCardIdList.map(id => new NameCard(id, enka)) : [];

        /** @type {number} */
        this.level = playerInfo.level;

        /** @type {number} */
        this.worldLevel = playerInfo.worldLevel ?? 0;

        /** @type {NameCard} */
        this.profileCard = new NameCard(playerInfo.nameCardId, enka);

        /** @type {number} */
        this.achievements = playerInfo.finishAchievementNum ?? 0;

        /** @type {number | null} */
        this.abyssFloor = playerInfo.towerFloorIndex ?? null;

        /** @type {number | null} */
        this.abyssChamber = playerInfo.towerLevelIndex ?? null;

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