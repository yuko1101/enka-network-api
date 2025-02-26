import { JsonReader, JsonObject } from "config_file.js";
import { EnkaClient } from "../../client/EnkaClient";
import { AssetsNotFoundError } from "../../errors/AssetsNotFoundError";
import { ImageAssets } from "../assets/ImageAssets";
import { TextAssets } from "../assets/TextAssets";
import { excelJsonOptions } from "../../client/CachedAssetsManager";

export type ItemType = "ITEM_VIRTUAL" | "ITEM_MATERIAL";

export class Material {
    readonly id: number;
    readonly enka: EnkaClient;
    readonly name: TextAssets;
    readonly description: TextAssets;
    readonly icon: ImageAssets;
    readonly pictures: ImageAssets[];
    readonly itemType: ItemType;
    readonly materialType: string | null;
    readonly stars: number | null;

    readonly _data: JsonObject;

    constructor(data: JsonObject, enka: EnkaClient) {
        this._data = data;
        this.enka = enka;

        const json = new JsonReader(excelJsonOptions, this._data);

        this.id = json.getAsNumber("id");

        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this.icon = new ImageAssets(json.getAsString("icon"), enka);

        this.pictures = json.get("picPath").mapArray((_, name) => new ImageAssets(name.getAsString(), enka));

        this.itemType = json.getAsString("itemType") as ItemType;

        this.materialType = json.getAsStringWithDefault(null, "materialType");

        this.stars = json.getAsNumberWithDefault(null, "rankLevel");
    }

    static getMaterialByData(data: JsonObject, enka: EnkaClient): Material {
        const json = new JsonReader(excelJsonOptions, data);
        switch (json.getAsStringWithDefault(null, "materialType")) {
            case NameCard.MATERIAL_TYPE:
                return new NameCard(data, enka);
            default:
                return new Material(data, enka);
        }
    }

    static getMaterialById(id: number | string, enka: EnkaClient): Material {
        if (isNaN(Number(id))) throw new Error("Parameter `id` must be a number or a string number.");
        id = Number(id);
        const materialData = enka.cachedAssetsManager.getGenshinCacheData("MaterialExcelConfigData").findArray((_, p) => p.getAsNumber("id") === id)?.[1];
        if (!materialData) throw new AssetsNotFoundError("Material", id);

        return this.getMaterialByData(materialData.getAsJsonObject(), enka);
    }
}


export class NameCard extends Material {
    override readonly materialType: "MATERIAL_NAMECARD";

    constructor(data: JsonObject, enka: EnkaClient) {
        super(data, enka);
        this.materialType = "MATERIAL_NAMECARD";
    }

    static readonly MATERIAL_TYPE = "MATERIAL_NAMECARD";
}