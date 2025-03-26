import { JsonReader, JsonObject } from "config_file.js";
import { EnkaClient } from "../../client/EnkaClient";
import { AssetsNotFoundError } from "../../errors/AssetsNotFoundError";
import { ImageAssets } from "../assets/ImageAssets";
import { TextAssets } from "../assets/TextAssets";
import { getNameIdByCharacterId } from "../../utils/character_utils";
import { CharacterData } from "./CharacterData";
import { excelJsonOptions } from "../../client/ExcelTransformer";

export class Costume {
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

        const json = new JsonReader(excelJsonOptions, this._data);

        this.id = json.getAsNumber("skinId");

        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this.characterId = json.getAsNumber("characterId");

        this.isDefault = json.getAsBooleanWithDefault(false, "isDefault");

        this._nameId = !this.isDefault ? [json.getAsString("jsonName")].map(jsonName => jsonName.slice(jsonName.lastIndexOf("_") + 1))[0] : getNameIdByCharacterId(this.characterId, enka);

        this.icon = new ImageAssets(`UI_AvatarIcon_${this._nameId}`, enka);

        this.sideIcon = new ImageAssets(`UI_AvatarIcon_Side_${this._nameId}`, enka);

        this.splashImage = new ImageAssets(!this.isDefault ? `UI_Costume_${this._nameId}` : `UI_Gacha_AvatarImg_${this._nameId}`, enka);

        this.stars = !this.isDefault ? json.getAsNumber("quality") : null;

        this.cardIcon = new ImageAssets(this.isDefault ? "UI_AvatarIcon_Costume_Card" : `UI_AvatarIcon_${this._nameId}_Card`, enka);
    }

    getCharacterData(): CharacterData {
        return CharacterData.getById(this.characterId, this.enka);
    }

    static getById(characterId: number, id: number, enka: EnkaClient): Costume {
        const data = enka.cachedAssetsManager.getExcelData("AvatarCostumeExcelConfigData", characterId, id);
        if (!data) throw new AssetsNotFoundError("Costume", id);
        return new Costume(data, enka);
    }

    // TODO: make this faster
    static getBySkinId(id: number, enka: EnkaClient): Costume {
        const json = Object.values(enka.cachedAssetsManager.getExcelData("AvatarCostumeExcelConfigData"))
            .flatMap(c => Object.values(c))
            .map(c => new JsonReader(excelJsonOptions, c))
            .find(j => j.getAsNumber("skinId") === id);
        if (!json) throw new AssetsNotFoundError("Costume", id);
        return new Costume(json.getAsJsonObject(), enka);
    }

    static getDefaultCostumeByCharacterId(characterId: number, enka: EnkaClient): Costume {
        const characterCostumes = enka.cachedAssetsManager.getExcelData("AvatarCostumeExcelConfigData", characterId);
        if (!characterCostumes) throw new AssetsNotFoundError("Costume for character id", characterId);
        const json = Object.values(characterCostumes)
            .map(c => new JsonReader(excelJsonOptions, c))
            .find(j => j.getAsNumber("characterId") === characterId && j.getAsBooleanWithDefault(false, "isDefault"));
        if (!json) throw new AssetsNotFoundError("Default costume", characterId);
        return new Costume(json.getAsJsonObject(), enka);
    }
}
