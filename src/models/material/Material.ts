import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import ImageAssets from "../assets/ImageAssets";
import TextAssets from "../assets/TextAssets";

/** @typedef */
export type ItemType = "ITEM_VIRTUAL" | "ITEM_MATERIAL";

/**
 * @en Material
 */
class Material {
    /**  */
    readonly id: number;
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly name: TextAssets;
    /**  */
    readonly description: TextAssets;
    /**  */
    readonly icon: ImageAssets;
    /**  */
    readonly pictures: ImageAssets[];
    /**  */
    readonly itemType: ItemType;
    /**  */
    readonly materialType: string | null;
    /**  */
    readonly stars: number | null;

    readonly _data: JsonObject;

    /**
     * @param id
     * @param enka
     * @param data If this provided, use this instead of searching with `id`.
     */
    constructor(id: number, enka: EnkaClient, data?: JsonObject) {
        this.id = id;

        this.enka = enka;

        const _data: JsonObject | undefined = data ?? enka.cachedAssetsManager.getGenshinCacheData("MaterialExcelConfigData").find(m => m.id === this.id);
        if (!_data) throw new AssetsNotFoundError("Material", this.id);
        this._data = _data;

        this.name = new TextAssets(this._data.nameTextMapHash as number, enka);

        this.description = new TextAssets(this._data.descTextMapHash as number, enka);

        this.icon = new ImageAssets(this._data.icon as string, enka);

        this.pictures = (this._data.picPath as string[]).map(name => new ImageAssets(name, enka));

        this.itemType = this._data.itemType as ItemType;

        this.materialType = (this._data.materialType ?? null) as string | null;

        this.stars = (this._data.rankLevel ?? null) as number | null;
    }

    /**
     * @param id
     * @param enka
     * @param data If this provided, use this instead of searching with `id`.
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

export default Material;

/**
 * @en NameCard
 * @extends {Material}
 */
class NameCard extends Material {
    /**  */
    override readonly materialType: "MATERIAL_NAMECARD";

    /**
     * @param id
     * @param enka
     * @param data If this provided, use this instead of searching with `id`.
     */
    constructor(id: number, enka: EnkaClient, data?: JsonObject) {
        super(id, enka, data);
        this.materialType = "MATERIAL_NAMECARD";
    }

    /**  */
    static readonly MATERIAL_TYPE = "MATERIAL_NAMECARD";
}

export { NameCard };