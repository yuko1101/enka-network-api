import { JsonObject } from "config_file.js";
import CharacterData from "./character/CharacterData";
import Costume from "./character/Costume";
import EnkaProfile from "./enka/EnkaProfile";
import { NameCard } from "./material/Material";
import EnkaClient from "../client/EnkaClient";

export type CharacterPreview = { characterData: CharacterData, level: number, costume: Costume };

/**
 * @en User
 */
export default class User {
    readonly enka: EnkaClient;
    readonly _data: JsonObject;
    readonly uid: number;
    readonly nickname: string | null;
    readonly signature: string | null;
    readonly profilePictureCharacter: CharacterData | null;
    readonly charactersPreview: CharacterPreview[];
    readonly nameCards: NameCard[];
    readonly level: number;
    readonly worldLevel: number;
    readonly profileCard: NameCard;
    readonly achievements: number;
    readonly spiralAbyss: {
        floor: number,
        chamber: number,
    } | null;
    readonly ttl: number;
    readonly enkaProfile: EnkaProfile | null;
    readonly enkaUserHash: string | null;
    readonly url: string;

    /**
     * @param uid For players who do not have uid in multiplayer profile (who do not have unlocked multiplayer yet).
     */
    constructor(data: JsonObject, enka: EnkaClient, uid?: number | string) {
        this.enka = enka;

        this._data = data;

        if (!enka.cachedAssetsManager.hasAllContents()) throw new Error("Complete Genshin data cache not found.\nYou need to fetch Genshin data by EnkaClient#cachedAssetsManager#fetchAllContents.");

        this.uid = isNaN(Number(data.uid)) && uid ? Number(uid) : Number(data.uid);

        const playerInfo = data.playerInfo as JsonObject;

        this.nickname = (playerInfo.nickname ?? null) as string | null;

        this.signature = (playerInfo.signature ?? null) as string | null;

        const profilePicture = playerInfo.profilePicture as JsonObject | undefined;
        this.profilePictureCharacter = profilePicture?.avatarId ? new CharacterData(profilePicture.avatarId as number, enka) : null;

        this.charactersPreview = playerInfo.showAvatarInfoList ? (playerInfo.showAvatarInfoList as JsonObject[]).map(obj => {
            const characterData = new CharacterData(obj.avatarId as number, enka);

            const costume = obj["costumeId"] ? new Costume(obj["costumeId"] as number, enka) : (characterData.costumes.find(c => c.isDefault) as Costume);

            const preview: CharacterPreview = {
                characterData,
                level: obj.level as number,
                costume,
            };

            return preview;
        }) : [];

        this.nameCards = playerInfo.showNameCardIdList ? (playerInfo.showNameCardIdList as number[]).map(id => new NameCard(id, enka)) : [];

        this.level = playerInfo.level as number;

        this.worldLevel = (playerInfo.worldLevel ?? 0) as number;

        this.profileCard = new NameCard(playerInfo.nameCardId as number, enka);

        this.achievements = (playerInfo.finishAchievementNum ?? 0) as number;

        this.spiralAbyss = playerInfo.towerFloorIndex && playerInfo.towerLevelIndex ? { floor: playerInfo.towerFloorIndex as number, chamber: playerInfo.towerLevelIndex as number } : null;

        this.ttl = data.ttl as number;

        this.enkaProfile = data.owner ? new EnkaProfile(data.owner as JsonObject, enka) : null;

        this.enkaUserHash = ((data.owner as JsonObject | undefined)?.hash ?? null) as string | null;

        this.url = `${enka.options.enkaUrl}/u/${this.uid}`;
    }
}