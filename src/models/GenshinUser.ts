import { JsonReader, JsonObject } from "config_file.js";
import { EnkaProfile, User } from "enka-system";
import CharacterData from "./character/CharacterData";
import Costume from "./character/Costume";
import Material, { NameCard } from "./material/Material";
import EnkaClient from "../client/EnkaClient";

/** @typedef */
export interface CharacterPreview {
    character: CostumedCharacter,
    level: number;
}

/** @typedef */
export interface CostumedCharacter {
    characterData: CharacterData,
    costume: Costume,
}

/**
 * @en GenshinUser
 */
class GenshinUser extends User {
    /**  */
    readonly enka: EnkaClient;
    /** This will be NaN if this GenshinUser is from EnkaGameAccount and [isUidPublic](EnkaGameAccount#isUidPublic) is false. */
    readonly uid: number;
    /**  */
    readonly nickname: string | null;
    /**  */
    readonly signature: string | null;
    /**  */
    readonly profilePicture: CostumedCharacter | null;
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

    /** This will be -1 if this GenshinUser is from EnkaGameAccount */
    readonly ttl: number;
    /**  */
    readonly enkaProfile: EnkaProfile | null;
    /**  */
    readonly enkaGameAccountHash: string | null;
    /**  */
    readonly url: string;

    /**
     * @param data
     * @param enka
    */
    constructor(data: JsonObject, enka: EnkaClient) {
        const json = new JsonReader(data);
        super(json);

        this.enka = enka;

        if (!enka.cachedAssetsManager.hasAllContents()) throw new Error("Complete Genshin data cache not found.\nYou need to fetch Genshin data by EnkaClient#cachedAssetsManager#fetchAllContents.");


        this.uid = Number(json.getValue("uid"));

        const playerInfo = json.get("playerInfo");

        this.nickname = playerInfo.getAsStringWithDefault(null, "nickname");

        this.signature = playerInfo.getAsStringWithDefault(null, "signature");

        const profilePic = playerInfo.get("profilePicture");
        const profilePictureCharacter = profilePic.has("avatarId") ? CharacterData.getById(profilePic.getAsNumber("avatarId"), enka) : null;
        const profilePictureCostumeId = profilePic.getAsNumberWithDefault(null, "costumeId");
        this.profilePicture = profilePictureCharacter ? {
            characterData: profilePictureCharacter,
            costume: profilePictureCharacter.costumes.find(c => (profilePictureCostumeId === null && c.isDefault) || (c.id === profilePictureCostumeId)) as Costume,
        } : null;

        this.charactersPreview = playerInfo.has("showAvatarInfoList") ? playerInfo.get("showAvatarInfoList").mapArray((_, p) => {
            const characterData = CharacterData.getById(p.getAsNumber("avatarId"), enka);

            const costumeId = p.getAsNumberWithDefault(null, "costumeId");
            const costume = characterData.costumes.find(c => (costumeId === null && c.isDefault) || (c.id === costumeId)) as Costume;

            const preview: CharacterPreview = {
                character: {
                    characterData,
                    costume,
                },
                level: p.getAsNumber("level"),
            };

            return preview;
        }) : [];

        this.nameCards = playerInfo.has("showNameCardIdList") ? playerInfo.get("showNameCardIdList").mapArray((_, id) => Material.getMaterialById(id.getAsNumber(), enka) as NameCard) : [];

        this.level = playerInfo.getAsNumber("level");

        this.worldLevel = playerInfo.getAsNumberWithDefault(0, "worldLevel");

        this.profileCard = Material.getMaterialById(playerInfo.getAsNumber("nameCardId"), enka) as NameCard;

        this.achievements = playerInfo.getAsNumberWithDefault(0, "finishAchievementNum");

        this.spiralAbyss = playerInfo.has("towerFloorIndex") && playerInfo.has("towerLevelIndex") ? { floor: playerInfo.getAsNumber("towerFloorIndex"), chamber: playerInfo.getAsNumber("towerLevelIndex") } : null;

        this.ttl = json.getAsNumberWithDefault(-1, "ttl");

        this.enkaProfile = json.has("owner") ? new EnkaProfile(json.getAsJsonObject("owner")) : null;

        this.enkaGameAccountHash = json.getAsStringWithDefault(null, "owner", "hash");

        this.url = `${enka.options.enkaUrl}/u/${this.uid}/`;
    }
}

export default GenshinUser;