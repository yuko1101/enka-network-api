import { JsonManager, JsonObject } from "config_file.js";
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
     * @param id
     * @param enka
     * @param data If this is provided, use this instead of searching with `id`.
     */
    constructor(id: number, enka: EnkaClient, data?: JsonManager) {

        this.enka = enka;

        this.id = id;

        const json = data ?? enka.cachedAssetsManager.getGenshinCacheData("WeaponExcelConfigData").find(p => p.getAsNumber("id") === this.id);
        if (!json) throw new AssetsNotFoundError("Weapon", this.id);
        this._data = json.getAsJsonObject();

        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this.icon = new ImageAssets(json.getAsString("icon"), enka);

        this.awakenIcon = new ImageAssets(json.getAsString("awakenIcon"), enka);

        this.stars = json.getAsNumber("rankLevel");

        this.weaponType = json.getAsString("weaponType") as WeaponType;

        const weaponTypeData = enka.cachedAssetsManager.getGenshinCacheData("ManualTextMapConfigData").find(p => p.getAsString("textMapId") === this.weaponType);
        if (!weaponTypeData) throw new AssetsNotFoundError("Weapon Type", this.weaponType);
        this._weaponTypeData = weaponTypeData.getAsJsonObject();

        this.weaponTypeName = new TextAssets(weaponTypeData.getAsNumber("textMapContentTextMapHash"), enka);

        this.refinements = json.get("skillAffix", 0).getAsNumber() !== 0 ? new WeaponRefinements(json.get("skillAffix", 0).getAsNumber(), enka).refinements : [];
    }
}

export default WeaponData;