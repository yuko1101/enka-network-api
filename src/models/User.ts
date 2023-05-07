import { JsonManager, JsonObject } from "config_file.js";
import CharacterData from "./character/CharacterData";
import Costume from "./character/Costume";
import EnkaProfile from "./enka/EnkaProfile";
import { NameCard } from "./material/Material";
import EnkaClient from "../client/EnkaClient";

/** @typedef */
export interface CharacterPreview {
    characterData: CharacterData;
    level: number;
    costume: Costume;
}

/**
 * @en User
 */
class User {
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly uid: number;
    /**  */
    readonly nickname: string | null;
    /**  */
    readonly signature: string | null;
    /**  */
    readonly profilePictureCharacter: CharacterData | null;
    /**  */
    readonly charactersPreview: CharacterPreview[];
    /**  */
    readonly nameCards: NameCard[];
    /**  */
    readonly level: number;
    /**  */
    readonly worldLevel: number;
    /**  */
    readonly profileCard: NameCard;
    /**  */
    readonly achievements: number;
    /**  */
    readonly spiralAbyss: {
        floor: number,
        chamber: number,
    } | null;

    /** This will be -1 if this User is from EnkaUser */
    readonly ttl: number;
    /**  */
    readonly enkaProfile: EnkaProfile | null;
    /**  */
    readonly enkaUserHash: string | null;
    /**  */
    readonly url: string;

    readonly _data: JsonObject;

    /**
     * @param data
     * @param enka
    */
    constructor(data: JsonObject, enka: EnkaClient) {
        this.enka = enka;

        this._data = data;

        if (!enka.cachedAssetsManager.hasAllContents()) throw new Error("Complete Genshin data cache not found.\nYou need to fetch Genshin data by EnkaClient#cachedAssetsManager#fetchAllContents.");

        const json = new JsonManager(this._data, true, true);

        this.uid = Number(json.getAs<number | string>("uid"));

        const playerInfo = json.get("playerInfo");

        this.nickname = playerInfo.has("nickname") ? playerInfo.getAsString("nickname") : null;

        this.signature = playerInfo.has("signature") ? playerInfo.getAsString("signature") : null;

        const profilePicture = playerInfo.get("profilePicture");
        this.profilePictureCharacter = profilePicture.has("avatarId") ? new CharacterData(profilePicture.getAsNumber("avatarId"), enka) : null;

        this.charactersPreview = playerInfo.has("showAvatarInfoList") ? playerInfo.get("showAvatarInfoList").map(p => {
            const characterData = new CharacterData(p.getAsNumber("avatarId"), enka);

            const costume = p.has("costumeId") ? new Costume(p.getAsNumber("costumeId"), enka) : (characterData.costumes.find(c => c.isDefault) as Costume);

            const preview: CharacterPreview = {
                characterData,
                level: p.getAsNumber("level"),
                costume,
            };

            return preview;
        }) : [];

        this.nameCards = playerInfo.has("showNameCardIdList") ? playerInfo.get("showNameCardIdList").map(id => new NameCard(id.getAsNumber(), enka)) : [];

        this.level = playerInfo.getAsNumber("level");

        this.worldLevel = playerInfo.has("worldLevel") ? playerInfo.getAsNumber("worldLevel") : 0;

        this.profileCard = new NameCard(playerInfo.getAsNumber("nameCardId"), enka);

        this.achievements = playerInfo.has("finishAchievementNum") ? playerInfo.getAsNumber("finishAchievementNum") : 0;

        this.spiralAbyss = playerInfo.has("towerFloorIndex") && playerInfo.has("towerLevelIndex") ? { floor: playerInfo.getAsNumber("towerFloorIndex"), chamber: playerInfo.getAsNumber("towerLevelIndex") } : null;

        this.ttl = json.has("ttl") ? json.getAsNumber("ttl") : -1;

        this.enkaProfile = json.has("owner") ? new EnkaProfile(json.getAsJsonObject("owner"), enka) : null;

        this.enkaUserHash = json.has("owner") ? json.get("owner").getAsString("hash") : null;

        this.url = `${enka.options.enkaUrl}/u/${this.uid}`;
    }
}

export default User;