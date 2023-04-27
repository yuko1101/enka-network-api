import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import ImageAssets from "../assets/ImageAssets";
import TextAssets from "../assets/TextAssets";
import WeaponRefinements from "./WeaponRefinements";
import WeaponRefinement from "./WeaponRefinement";

export type WeaponType = "WEAPON_SWORD_ONE_HAND" | "WEAPON_CLAYMORE" | "WEAPON_POLE" | "WEAPON_CATALYST" | "WEAPON_BOW";

/**
 * @en WeaponData
 */
export default class WeaponData {
    public enka: EnkaClient;
    public id: number;
    public _data: JsonObject;
    public name: TextAssets;
    public description: TextAssets;
    public icon: ImageAssets;
    public awakenIcon: ImageAssets;
    public stars: number;
    public weaponType: WeaponType;
    public _weaponTypeData: JsonObject;
    public weaponTypeName: TextAssets;
    public refinements: WeaponRefinement[];

    /**
     * @param data If `data` provided, use `data` instead of searching with `id`.
     */
    constructor(id: number, enka: EnkaClient, data?: JsonObject) {

        this.enka = enka;

        this.id = id;

        const _data: JsonObject | undefined = data ?? enka.cachedAssetsManager.getGenshinCacheData("WeaponExcelConfigData").find(w => w.id === id);
        if (!_data) throw new AssetsNotFoundError("Weapon", id);
        this._data = _data;

        this.name = new TextAssets(this._data.nameTextMapHash as number, enka);

        this.description = new TextAssets(this._data.descTextMapHash as number, enka);

        this.icon = new ImageAssets(this._data.icon as string, enka);

        this.awakenIcon = new ImageAssets(this._data.awakenIcon as string, enka);

        this.stars = this._data.rankLevel as number;

        this.weaponType = this._data.weaponType as WeaponType;

        const _weaponTypeData: JsonObject | undefined = enka.cachedAssetsManager.getGenshinCacheData("ManualTextMapConfigData").find(t => t.textMapId === this.weaponType);
        if (!_weaponTypeData) throw new AssetsNotFoundError("Weapon Type", this.weaponType);
        this._weaponTypeData = _weaponTypeData;

        this.weaponTypeName = new TextAssets(this._weaponTypeData.textMapContentTextMapHash as number, enka);

        this.refinements = (this._data.skillAffix as number[])[0] !== 0 ? new WeaponRefinements((this._data.skillAffix as number[])[0], enka).refinements : [];
    }
}