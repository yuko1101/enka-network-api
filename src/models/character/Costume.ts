import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import ImageAssets from "../assets/ImageAssets";
import TextAssets from "../assets/TextAssets";
import { getNameIdByCharacterId } from "../../utils/character_utils";

/**
 * @en Costume
 */
class Costume {
    readonly id: number;
    readonly enka: EnkaClient;
    readonly _data: JsonObject;
    readonly name: TextAssets;
    readonly description: TextAssets;
    readonly characterId: number;
    readonly isDefault: boolean;
    readonly _nameId: string;
    readonly icon: ImageAssets;
    readonly sideIcon: ImageAssets;
    readonly splashImage: ImageAssets;
    /** This is null if the costume is default */
    readonly stars: number | null;
    readonly cardIcon: ImageAssets;

    /**
     * @param data If `data` provided, use `data` instead of searching with `id`.
     */
    constructor(id: number | null, enka: EnkaClient, data?: JsonObject) {

        const keys = enka.cachedAssetsManager.getObjectKeysManager();

        this.id = (data ? data[keys.costumeIdKey] : id) as number;

        this.enka = enka;

        const _data: JsonObject | undefined = data ?? enka.cachedAssetsManager.getGenshinCacheData("AvatarCostumeExcelConfigData").find(c => c[keys.costumeIdKey] === this.id);
        if (!_data) throw new AssetsNotFoundError("Costume", this.id);
        this._data = _data;

        this.name = new TextAssets(this._data.nameTextMapHash as number, enka);

        this.description = new TextAssets(this._data.descTextMapHash as number, enka);

        this.characterId = this._data[keys.costumeCharacterIdKey] as number;

        this.isDefault = !!this._data.isDefault;

        this._nameId = !this.isDefault && this._data.jsonName ? (this._data.jsonName as string).slice((this._data.jsonName as string).lastIndexOf("_") + 1) : getNameIdByCharacterId(this.characterId, enka);

        this.icon = new ImageAssets(`UI_AvatarIcon_${this._nameId}`, enka);

        this.sideIcon = new ImageAssets(`UI_AvatarIcon_Side_${this._nameId}`, enka);

        this.splashImage = new ImageAssets(!this.isDefault ? `UI_Costume_${this._nameId}` : `UI_Gacha_AvatarImg_${this._nameId}`, enka);

        this.stars = !this.isDefault ? this._data[keys.costumeStarKey] as number : null;

        this.cardIcon = new ImageAssets(this.isDefault ? "UI_AvatarIcon_Costume_Card" : `UI_AvatarIcon_${this._nameId}_Card`, enka);
    }
}

export default Costume;