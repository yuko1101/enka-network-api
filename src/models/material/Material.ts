import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import ImageAssets from "../assets/ImageAssets";
import TextAssets from "../assets/TextAssets";
import NameCard from "./NameCard";

export type ItemType = "ITEM_VIRTUAL" | "ITEM_MATERIAL";

/**
 * @en Material
 */
export default class Material {
    public id: number;
    public enka: EnkaClient;
    public _data: JsonObject;
    public name: TextAssets;
    public description: TextAssets;
    public icon: ImageAssets;
    public pictures: ImageAssets[];
    public itemType: ItemType;
    public materialType: string | null;
    public stars: number;

    /**
     * @param {number} id
     * @param {import("../../client/EnkaClient")} enka
     * @param {Object<string, any>} [data] If `data` provided, use `data` instead of searching with `id`.
     */
    constructor(id: number, enka: EnkaClient, data?: JsonObject) {
        /** @type {number} */
        this.id = id;

        /** @type {import("../../client/EnkaClient")} */
        this.enka = enka;

        const _data: JsonObject | undefined = data ?? enka.cachedAssetsManager.getGenshinCacheData("MaterialExcelConfigData").find(m => m.id === id);
        if (!_data) throw new AssetsNotFoundError("Material", id);
        this._data = _data;

        /** @type {TextAssets} */
        this.name = new TextAssets(this._data.nameTextMapHash as number, enka);

        /** @type {TextAssets} */
        this.description = new TextAssets(this._data.descTextMapHash as number, enka);

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.icon as string, enka);

        /** @type {Array<ImageAssets>} */
        this.pictures = (this._data.picPath as string[]).map(name => new ImageAssets(name, enka));

        /** @type {"ITEM_VIRTUAL"|"ITEM_MATERIAL"} */
        this.itemType = this._data.itemType as ItemType;

        /** @type {string | null} */
        this.materialType = (this._data.materialType ?? null) as string | null;

        /** @type {number} */
        this.stars = this._data.rankLevel as number;

    }

    /**
     * @param data If `data` provided, use `data` instead of searching with `id`.
     */
    static getMaterialById(id: number | string, enka: EnkaClient, data?: JsonObject): Material {
        if (isNaN(Number(id))) throw new Error("Parameter `id` must be a number or a string number.");
        id = Number(id);
        const materialData = data ?? enka.cachedAssetsManager.getGenshinCacheData("MaterialExcelConfigData").find(m => m.id === id);
        if (!materialData) throw new AssetsNotFoundError("Material", id);

        switch (materialData.materialType) {
            case NameCard.MATERIAL_TYPE:
                return new NameCard(id, enka, materialData);
            default:
                return new Material(id, enka, materialData);
        }
    }
}