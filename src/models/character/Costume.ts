import { JsonReader, JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import ImageAssets from "../assets/ImageAssets";
import TextAssets from "../assets/TextAssets";
import { getNameIdByCharacterId } from "../../utils/character_utils";
import CharacterData from "./CharacterData";

class Costume {
    readonly id: number;
    readonly enka: EnkaClient;
    readonly name: TextAssets;
    readonly description: TextAssets;
    readonly characterId: number;
    readonly isDefault: boolean;
    readonly icon: ImageAssets;
    readonly sideIcon: ImageAssets;
    readonly splashImage: ImageAssets;
    /** This is null if the costume is default */
    readonly stars: number | null;
    readonly cardIcon: ImageAssets;

    readonly _data: JsonObject;
    readonly _nameId: string;

    constructor(data: JsonObject, enka: EnkaClient) {
        this.enka = enka;
        this._data = data;

        const json = new JsonReader(this._data);

        this.id = json.getAsNumber("skinId");

        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this.characterId = json.getAsNumber("characterId");

        this.isDefault = json.getAsBooleanWithDefault(false, "isDefault");

        const jsonName = json.getAsString("jsonName");
        this._nameId = !this.isDefault ? jsonName.slice(jsonName.lastIndexOf("_") + 1) : getNameIdByCharacterId(this.characterId, enka);

        this.icon = new ImageAssets(`UI_AvatarIcon_${this._nameId}`, enka);

        this.sideIcon = new ImageAssets(`UI_AvatarIcon_Side_${this._nameId}`, enka);

        this.splashImage = new ImageAssets(!this.isDefault ? `UI_Costume_${this._nameId}` : `UI_Gacha_AvatarImg_${this._nameId}`, enka);

        this.stars = !this.isDefault ? json.getAsNumber("quality") : null;

        this.cardIcon = new ImageAssets(this.isDefault ? "UI_AvatarIcon_Costume_Card" : `UI_AvatarIcon_${this._nameId}_Card`, enka);
    }

    getCharacterData(): CharacterData {
        return CharacterData.getById(this.characterId, this.enka);
    }

    static getById(id: number, enka: EnkaClient): Costume {
        const json = enka.cachedAssetsManager.getGenshinCacheData("AvatarCostumeExcelConfigData").findArray((_, p) => p.getAsNumber("skinId") === id)?.[1];
        if (!json) throw new AssetsNotFoundError("Costume", id);
        return new Costume(json.getAsJsonObject(), enka);
    }

    static getDefaultCostumeByCharacterId(characterId: number, enka: EnkaClient): Costume {
        const json = enka.cachedAssetsManager.getGenshinCacheData("AvatarCostumeExcelConfigData").findArray((_, p) => p.getAsNumber("characterId") === characterId && p.getAsBooleanWithDefault(false, "isDefault"))?.[1];
        if (!json) throw new AssetsNotFoundError("Default costume", characterId);
        return new Costume(json.getAsJsonObject(), enka);
    }
}

export default Costume;