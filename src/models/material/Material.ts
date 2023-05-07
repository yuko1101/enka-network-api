import { JsonReader, JsonObject } from "config_file.js";
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
    constructor(id: number, enka: EnkaClient, data?: JsonReader) {
        this.id = id;

        this.enka = enka;

        const json = data ?? enka.cachedAssetsManager.getGenshinCacheData("MaterialExcelConfigData").findArray((_, p) => p.getAsNumber("id") === this.id)?.[1];
        if (!json) throw new AssetsNotFoundError("Material", this.id);
        this._data = json.getAsJsonObject();

        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this.icon = new ImageAssets(json.getAsString("icon"), enka);

        this.pictures = json.get("picPath").mapArray((_, name) => new ImageAssets(name.getAsString(), enka));

        this.itemType = json.getAsString("itemType") as ItemType;

        this.materialType = json.getAsStringWithDefault(null, "materialType");

        this.stars = json.getAsNumberWithDefault(null, "rankLevel");
    }

    /**
     * @param id
     * @param enka
     * @param data If this provided, use this instead of searching with `id`.
     */
    static getMaterialById(id: number | string, enka: EnkaClient, data?: JsonReader): Material {
        if (isNaN(Number(id))) throw new Error("Parameter `id` must be a number or a string number.");
        id = Number(id);
        const materialData = data ?? enka.cachedAssetsManager.getGenshinCacheData("MaterialExcelConfigData").findArray((_, p) => p.getAsNumber("id") === id)?.[1];
        if (!materialData) throw new AssetsNotFoundError("Material", id);

        switch (materialData.getAsStringWithDefault(null, "materialType")) {
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
    constructor(id: number, enka: EnkaClient, data?: JsonReader) {
        super(id, enka, data);
        this.materialType = "MATERIAL_NAMECARD";
    }

    /**  */
    static readonly MATERIAL_TYPE = "MATERIAL_NAMECARD";
}

export { NameCard };