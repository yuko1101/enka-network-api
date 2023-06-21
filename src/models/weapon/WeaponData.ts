import { JsonReader, JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import ImageAssets from "../assets/ImageAssets";
import TextAssets from "../assets/TextAssets";
import WeaponRefinements from "./WeaponRefinements";
import WeaponRefinement from "./WeaponRefinement";

/** @typedef */
export type WeaponType = "WEAPON_SWORD_ONE_HAND" | "WEAPON_CLAYMORE" | "WEAPON_POLE" | "WEAPON_CATALYST" | "WEAPON_BOW";

/**
 * @en WeaponData
 */
class WeaponData {
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly id: number;
    /**  */
    readonly name: TextAssets;
    /**  */
    readonly description: TextAssets;
    /**  */
    readonly icon: ImageAssets;
    /**  */
    readonly awakenIcon: ImageAssets;
    /**  */
    readonly stars: number;
    /**  */
    readonly weaponType: WeaponType;
    /**  */
    readonly weaponTypeName: TextAssets;
    /**  */
    readonly refinements: WeaponRefinement[];

    readonly _data: JsonObject;
    readonly _weaponTypeData: JsonObject;

    /**
     * @param data
     * @param enka
     */
    constructor(data: JsonObject, enka: EnkaClient) {
        this._data = data;
        this.enka = enka;

        const json = new JsonReader(this._data);

        this.id = json.getAsNumber("id");

        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this.icon = new ImageAssets(json.getAsString("icon"), enka);

        this.awakenIcon = new ImageAssets(json.getAsString("awakenIcon"), enka);

        this.stars = json.getAsNumber("rankLevel");

        this.weaponType = json.getAsString("weaponType") as WeaponType;

        const weaponTypeData = enka.cachedAssetsManager.getGenshinCacheData("ManualTextMapConfigData").findArray((_, p) => p.getAsString("textMapId") === this.weaponType)?.[1];
        if (!weaponTypeData) throw new AssetsNotFoundError("Weapon Type", this.weaponType);
        this._weaponTypeData = weaponTypeData.getAsJsonObject();

        this.weaponTypeName = new TextAssets(weaponTypeData.getAsNumber("textMapContentTextMapHash"), enka);

        this.refinements = json.getAsNumber("skillAffix", 0) !== 0 ? new WeaponRefinements(json.getAsNumber("skillAffix", 0), enka).refinements : [];
    }

    /**
     * @param id
     * @param enka
     */
    static getById(id: number, enka: EnkaClient): WeaponData {
        const json = enka.cachedAssetsManager.getGenshinCacheData("WeaponExcelConfigData").findArray((_, p) => p.getAsNumber("id") === id)?.[1];
        if (!json) throw new AssetsNotFoundError("Weapon", id);
        return new WeaponData(json.getAsJsonObject(), enka);
    }
}

export default WeaponData;