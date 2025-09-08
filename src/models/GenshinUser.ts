import { JsonReader, JsonObject, defaultJsonOptions } from "config_file.js";
import { EnkaProfile, User } from "enka-system";
import { Costume } from "./character/Costume";
import { Material, NameCard } from "./material/Material";
import { EnkaClient } from "../client/EnkaClient";
import { ProfilePicture } from "./ProfilePicture";
import { Element, elementList, ElementType } from "./Element";
import { TheaterMode } from "./theater/TheaterMode";

export interface CharacterPreview {
    /** Costume whose icon is used for character preview. */
    costume: Costume;
    level: number;
    element: Element | null;
    constellation: number | null;
}

export class GenshinUser extends User {
    readonly enka: EnkaClient;
    /** This will be NaN if this GenshinUser is from [EnkaGameAccount](https://enka-system.vercel.app/docs/api/EnkaGameAccount) and [isUidPublic](https://enka-system.vercel.app/docs/api/EnkaGameAccount#isUidPublic) is `false`. */
    readonly uid: number;
    readonly nickname: string | null;
    readonly signature: string | null;
    readonly profilePicture: ProfilePicture | null;
    readonly showConstellationPreview: boolean;
    readonly charactersPreview: CharacterPreview[];
    readonly nameCards: NameCard[];
    readonly level: number;
    readonly worldLevel: number;
    readonly profileCard: NameCard;
    readonly achievements: number;
    readonly maxFriendshipCount: number;
    readonly spiralAbyss: {
        floor: number,
        chamber: number,
        stars: number,
    } | null;
    readonly theater: {
        act: number,
        stars: number,
        mode: TheaterMode,
    } | null;
    readonly stygian: {
        scheduleId: number,
        difficulty: number,
        clearTime: number,
    } | null;

    /** This will be -1 if this GenshinUser is from EnkaGameAccount */
    readonly ttl: number;
    readonly enkaProfile: EnkaProfile | null;
    readonly enkaGameAccountHash: string | null;
    readonly url: string;

    constructor(data: JsonObject, enka: EnkaClient) {
        const json = new JsonReader(defaultJsonOptions, data);
        super(json);

        this.enka = enka;

        if (!enka.cachedAssetsManager.hasAllContents()) throw new Error("Complete Genshin data cache not found.\nYou need to fetch Genshin data by EnkaClient#cachedAssetsManager#fetchAllContents.");


        this.uid = Number(json.getValue("uid"));

        const playerInfo = json.get("playerInfo");

        this.nickname = playerInfo.getAsStringWithDefault(null, "nickname");

        this.signature = playerInfo.getAsStringWithDefault(null, "signature");

        const profilePic = playerInfo.get("profilePicture");
        this.profilePicture = profilePic.has("id") ? ProfilePicture.getById(profilePic.getAsNumber("id"), enka)
            : profilePic.has("avatarId") ? ProfilePicture.getByOldFormat(profilePic.getAsNumber("avatarId"), profilePic.getAsNumberWithDefault(null, "costumeId"), enka)
                : null;

        this.showConstellationPreview = playerInfo.getAsBooleanWithDefault(false, "isShowAvatarTalent");

        this.charactersPreview = playerInfo.has("showAvatarInfoList") ? playerInfo.get("showAvatarInfoList").mapArray((_, p) => {
            const costumeId = p.getAsNumberWithDefault(null, "costumeId");
            const costume = costumeId === null ? Costume.getDefaultCostumeByCharacterId(p.getAsNumber("avatarId"), enka) : Costume.getById(p.getAsNumber("avatarId"), costumeId, enka);

            const elementType = p.has("energyType") ? elementList[p.getAsNumber("energyType")] as ElementType : null;

            const preview: CharacterPreview = {
                costume: costume,
                level: p.getAsNumber("level"),
                element: elementType ? Element.getByElementType(elementType, enka) : null,
                constellation: p.getAsNumberWithDefault(null, "talentLevel"),
            };

            return preview;
        }) : [];

        this.nameCards = playerInfo.has("showNameCardIdList") ? playerInfo.get("showNameCardIdList").mapArray((_, id) => Material.getMaterialById(id.getAsNumber(), enka) as NameCard) : [];

        this.level = playerInfo.getAsNumber("level");

        this.worldLevel = playerInfo.getAsNumberWithDefault(0, "worldLevel");

        this.profileCard = Material.getMaterialById(playerInfo.getAsNumber("nameCardId"), enka) as NameCard;

        this.achievements = playerInfo.getAsNumberWithDefault(0, "finishAchievementNum");

        this.maxFriendshipCount = playerInfo.getAsNumberWithDefault(0, "fetterCount");

        this.spiralAbyss = playerInfo.has("towerFloorIndex") && playerInfo.has("towerLevelIndex") ? {
            floor: playerInfo.getAsNumber("towerFloorIndex"),
            chamber: playerInfo.getAsNumber("towerLevelIndex"),
            stars: playerInfo.getAsNumberWithDefault(0, "towerStarIndex"),
        } : null;

        this.theater = playerInfo.has("theaterActIndex") && playerInfo.has("theaterStarIndex") && playerInfo.has("theaterModeIndex") ? {
            act: playerInfo.getAsNumber("theaterActIndex"),
            stars: playerInfo.getAsNumber("theaterStarIndex"),
            mode: TheaterMode.getById(playerInfo.getAsNumber("theaterModeIndex"), enka),
        } : null;

        this.stygian = playerInfo.has("stygianId") && playerInfo.has("stygianIndex") ? {
            scheduleId: playerInfo.getAsNumber("stygianId"),
            difficulty: playerInfo.getAsNumber("stygianIndex"),
            clearTime: playerInfo.getAsNumberWithDefault(0, "stygianSeconds"),
        } : null;

        this.ttl = json.getAsNumberWithDefault(-1, "ttl");

        this.enkaProfile = json.has("owner") ? new EnkaProfile(enka.options.enkaSystem, json.getAsJsonObject("owner")) : null;

        this.enkaGameAccountHash = json.getAsStringWithDefault(null, "owner", "hash");

        this.url = `${enka.options.enkaUrl}/u/${this.uid}/`;
    }
}
