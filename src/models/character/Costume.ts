import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import ImageAssets from "../assets/ImageAssets";
import TextAssets from "../assets/TextAssets";
import { getNameIdByCharacterId } from "../../utils/character_utils";

/**
 * @en Costume
 */
export default class Costume {
    public id: number;
    public enka: EnkaClient;
    public _data: JsonObject;
    public name: TextAssets;
    public description: TextAssets;
    public characterId: number;
    public isDefault: boolean;
    public _nameId: string;
    public icon: ImageAssets;
    public sideIcon: ImageAssets;
    public splashImage: ImageAssets;
    public stars: number;
    public cardIcon: ImageAssets;

    /**
     * @param data If `data` provided, use `data` instead of searching with `id`.
     */
    constructor(id: number, enka: EnkaClient, data?: JsonObject) {

        const keys = enka.cachedAssetsManager.getObjectKeysManager();

        this.id = data ? data[keys.costumeIdKey] as number : id;

        this.enka = enka;

        const _data: JsonObject | undefined = data ?? enka.cachedAssetsManager.getGenshinCacheData("AvatarCostumeExcelConfigData").find(c => c[keys.costumeIdKey] === id);
        if (!_data) throw new AssetsNotFoundError("Costume", id);
        this._data = _data;

        this.name = new TextAssets(this._data.nameTextMapHash as number, enka);

        this.description = new TextAssets(this._data.descTextMapHash as number, enka);

        this.characterId = this._data[keys.costumeCharacterIdKey] as number;

        this.isDefault = !!this._data.isDefault;

        this._nameId = !this.isDefault && this._data.jsonName ? (this._data.jsonName as string).slice((this._data.jsonName as string).lastIndexOf("_") + 1) : getNameIdByCharacterId(this.characterId, enka);

        // TODO: use default character icon if costume is default.
        this.icon = !this.isDefault ? new ImageAssets(`UI_AvatarIcon_${this._nameId}`, enka) : null;

        this.sideIcon = !this.isDefault ? new ImageAssets(this._data.sideIconName as string, enka) : null;

        this.splashImage = !this.isDefault ? new ImageAssets(`UI_Costume_${this._nameId}`, enka) : null;

        this.stars = !this.isDefault ? this._data[keys.costumeStarKey] : null;

        this.cardIcon = new ImageAssets(this.isDefault ? "UI_AvatarIcon_Costume_Card" : `UI_AvatarIcon_${this._nameId}_Card`, enka);
    }
}