import { JsonObject, JsonReader } from "config_file.js";
import EnkaClient from "../client/EnkaClient";
import ImageAssets from "./assets/ImageAssets";
import TextAssets from "./assets/TextAssets";
import Costume from "./character/Costume";
import AssetsNotFoundError from "../errors/AssetsNotFoundError";

/** @typedef */
export type ProfilePictureType =
    | "PROFILE_PICTURE_UNLOCK_BY_AVATAR"
    | "PROFILE_PICTURE_UNLOCK_BY_COSTUME"
    | "PROFILE_PICTURE_UNLOCK_BY_ITEM";

/** @en ProfilePicture */
class ProfilePicture {
    /**  */
    readonly enka: EnkaClient;

    /**  */
    readonly icon: ImageAssets;
    /**  */
    readonly name: TextAssets;
    /**  */
    readonly type: ProfilePictureType;

    readonly _data: JsonObject;

    /**
     * @param data
     * @param enka
     */
    constructor(data: JsonObject, enka: EnkaClient) {
        this.enka = enka;
        this._data = data;

        const json = new JsonReader(this._data);

        this.icon = new ImageAssets(json.getAsString("iconPath"), enka);
        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        const keys = enka.cachedAssetsManager.getObjectKeysManager();
        this.type = json.getAsString(keys.profilePictureTypeKey) as ProfilePictureType;

    }

    /**
     * @param id
     * @param enka
     */
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
     * @param characterId
     * @param costumeId
     */
    static getByOldFormat(characterId: number, costumeId: number | null, enka: EnkaClient): ProfilePicture {
        const costume = costumeId === null ? Costume.getDefaultCostumeByCharacterId(characterId, enka) : Costume.getById(costumeId, enka);
        const keys = enka.cachedAssetsManager.getObjectKeysManager();
        const profilePicture = {
            id: 0,
            iconPath: costume.icon.name,
            nameTextMapHash: 0,
            [keys.profilePictureTypeKey]: costumeId ? "PROFILE_PICTURE_UNLOCK_BY_COSTUME" : "PROFILE_PICTURE_UNLOCK_BY_AVATAR",
            [keys.profilePictureReferenceIdKey]: costumeId ?? characterId,
        };
        return new CharacterProfilePicture(profilePicture, enka);
    }

}

export default ProfilePicture;

/** @en CharacterProfilePicture */
export class CharacterProfilePicture extends ProfilePicture {
    /**  */
    readonly costume: Costume;
    /**  */
    override readonly type: "PROFILE_PICTURE_UNLOCK_BY_AVATAR" | "PROFILE_PICTURE_UNLOCK_BY_COSTUME";

    /**
     * @param data
     * @param enka
     */
    constructor(data: JsonObject, enka: EnkaClient) {
        super(data, enka);

        const json = new JsonReader(this._data);

        const keys = enka.cachedAssetsManager.getObjectKeysManager();
        const type = json.getAsString(keys.profilePictureTypeKey) as ProfilePictureType;
        if (type !== "PROFILE_PICTURE_UNLOCK_BY_AVATAR" && type !== "PROFILE_PICTURE_UNLOCK_BY_COSTUME") throw new Error("Invalid type for CharacterProfilePicture");

        const referenceId = keys.profilePictureReferenceIdKey;
        const costume = type === "PROFILE_PICTURE_UNLOCK_BY_COSTUME"
            ? Costume.getById(json.getAsNumber(referenceId), enka)
            : Costume.getDefaultCostumeByCharacterId(json.getAsNumber(referenceId), enka);

        this.type = type;

        this.costume = costume;
    }
}