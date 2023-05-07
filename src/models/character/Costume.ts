import { JsonReader, JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import ImageAssets from "../assets/ImageAssets";
import TextAssets from "../assets/TextAssets";
import { getNameIdByCharacterId } from "../../utils/character_utils";

/**
 * @en Costume
 */
class Costume {
    /**  */
    readonly id: number;
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly name: TextAssets;
    /**  */
    readonly description: TextAssets;
    /**  */
    readonly characterId: number;
    /**  */
    readonly isDefault: boolean;
    /**  */
    readonly icon: ImageAssets;
    /**  */
    readonly sideIcon: ImageAssets;
    /**  */
    readonly splashImage: ImageAssets;
    /** This is null if the costume is default */
    readonly stars: number | null;
    /**  */
    readonly cardIcon: ImageAssets;

    readonly _data: JsonObject;
    readonly _nameId: string;

    /**
     * @param id
     * @param enka
     * @param data If this is provided, use this instead of searching with `id`.
     */
    constructor(id: number | null, enka: EnkaClient, data?: JsonReader) {
        if (id === null && data === undefined) throw new Error("Either id or data must have a value.");

        const keys = enka.cachedAssetsManager.getObjectKeysManager();

        this.id = (data ? data.getAsNumber(keys.costumeIdKey) : id) as number;

        this.enka = enka;

        const json = data ?? enka.cachedAssetsManager.getGenshinCacheData("AvatarCostumeExcelConfigData").findArray((_, p) => p.getAsNumber("keys.costumeIdKey") === this.id)?.[1];
        if (!json) throw new AssetsNotFoundError("Costume", this.id);
        this._data = json.getAsJsonObject();

        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this.characterId = json.getAsNumber(keys.costumeCharacterIdKey);

        this.isDefault = json.has("isDefault") ? json.getAsBoolean("isDefault") : false;

        const jsonName = json.getAsString("jsonName");
        this._nameId = !this.isDefault ? jsonName.slice(jsonName.lastIndexOf("_") + 1) : getNameIdByCharacterId(this.characterId, enka);

        this.icon = new ImageAssets(`UI_AvatarIcon_${this._nameId}`, enka);

        this.sideIcon = new ImageAssets(`UI_AvatarIcon_Side_${this._nameId}`, enka);

        this.splashImage = new ImageAssets(!this.isDefault ? `UI_Costume_${this._nameId}` : `UI_Gacha_AvatarImg_${this._nameId}`, enka);

        this.stars = !this.isDefault ? json.getAsNumber(keys.costumeStarKey) : null;

        this.cardIcon = new ImageAssets(this.isDefault ? "UI_AvatarIcon_Costume_Card" : `UI_AvatarIcon_${this._nameId}_Card`, enka);
    }
}

export default Costume;