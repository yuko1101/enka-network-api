import { JsonObject, JsonReader } from "config_file.js";
import { EnkaClient } from "../client/EnkaClient";
import { ImageAssets } from "./assets/ImageAssets";
import { TextAssets } from "./assets/TextAssets";
import { Costume } from "./character/Costume";
import { AssetsNotFoundError } from "../errors/AssetsNotFoundError";

export type ProfilePictureType =
    | "PROFILE_PICTURE_UNLOCK_BY_AVATAR"
    | "PROFILE_PICTURE_UNLOCK_BY_COSTUME"
    | "PROFILE_PICTURE_UNLOCK_BY_ITEM";

export class ProfilePicture {
    readonly enka: EnkaClient;

    readonly id: number;

    readonly icon: ImageAssets;
    readonly name: TextAssets;
    readonly type: ProfilePictureType;

    readonly _data: JsonObject;

    constructor(data: JsonObject, enka: EnkaClient) {
        this.enka = enka;
        this._data = data;

        const json = new JsonReader(this._data);

        this.id = json.getAsNumber("id");

        this.icon = new ImageAssets(json.getAsString("iconPath"), enka);
        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        const keys = enka.cachedAssetsManager.getObjectKeysManager();
        this.type = json.getAsString(keys.profilePictureTypeKey) as ProfilePictureType;

    }

    static getById(id: number, enka: EnkaClient): ProfilePicture {
        const profilePicture = enka.cachedAssetsManager.getGenshinCacheData("ProfilePictureExcelConfigData").findArray((_, p) => p.getAsNumber("id") === id)?.[1] as JsonReader;
        if (!profilePicture) throw new AssetsNotFoundError("ProfilePicture", id);

        const keys = enka.cachedAssetsManager.getObjectKeysManager();
        const type = profilePicture.getAsString(keys.profilePictureTypeKey) as ProfilePictureType;
        switch (type) {
            case "PROFILE_PICTURE_UNLOCK_BY_AVATAR":
            case "PROFILE_PICTURE_UNLOCK_BY_COSTUME":
                return new CharacterProfilePicture(profilePicture.getAsJsonObject(), enka);
            default:
                return new ProfilePicture(profilePicture.getAsJsonObject(), enka);
        }
    }

    /**
     * @deprecated
     */
    static getByOldFormat(characterId: number, costumeId: number | null, enka: EnkaClient): ProfilePicture {
        const iconType: ProfilePictureType = costumeId === null ? "PROFILE_PICTURE_UNLOCK_BY_AVATAR" : "PROFILE_PICTURE_UNLOCK_BY_COSTUME";
        const referenceId = costumeId === null ? characterId : costumeId;

        const keys = enka.cachedAssetsManager.getObjectKeysManager();
        const profilePictureData = enka.cachedAssetsManager.getGenshinCacheData("ProfilePictureExcelConfigData").findArray((_, p) => p.getAsString(keys.profilePictureTypeKey) === iconType && p.getAsNumber("unlockParam") === referenceId)?.[1] as JsonReader;

        return new CharacterProfilePicture(profilePictureData.getAsJsonObject(), enka);
    }

}


export class CharacterProfilePicture extends ProfilePicture {
    readonly costume: Costume;
    override readonly type: "PROFILE_PICTURE_UNLOCK_BY_AVATAR" | "PROFILE_PICTURE_UNLOCK_BY_COSTUME";

    constructor(data: JsonObject, enka: EnkaClient) {
        super(data, enka);

        const json = new JsonReader(this._data);

        const keys = enka.cachedAssetsManager.getObjectKeysManager();
        const type = json.getAsString(keys.profilePictureTypeKey) as ProfilePictureType;
        if (type !== "PROFILE_PICTURE_UNLOCK_BY_AVATAR" && type !== "PROFILE_PICTURE_UNLOCK_BY_COSTUME") throw new Error("Invalid type for CharacterProfilePicture");

        const costume = type === "PROFILE_PICTURE_UNLOCK_BY_COSTUME"
            ? Costume.getById(json.getAsNumber("unlockParam"), enka)
            : Costume.getDefaultCostumeByCharacterId(json.getAsNumber("unlockParam"), enka);

        this.type = type;

        this.costume = costume;
    }
}