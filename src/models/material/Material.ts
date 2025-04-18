import { JsonReader } from "config_file.js";
import { EnkaClient } from "../../client/EnkaClient";
import { AssetsNotFoundError } from "../../errors/AssetsNotFoundError";
import { ImageAssets } from "../assets/ImageAssets";
import { TextAssets } from "../assets/TextAssets";
import { ExcelJsonObject, excelJsonOptions } from "../../client/ExcelTransformer";

export type ItemType = "ITEM_VIRTUAL" | "ITEM_MATERIAL";

export class Material {
    readonly id: number;
    readonly enka: EnkaClient;
    readonly name: TextAssets;
    readonly description: TextAssets;
    readonly icon: ImageAssets | null;
    readonly pictures: ImageAssets[];
    readonly itemType: ItemType;
    readonly materialType: string | null;
    readonly stars: number | null;

    readonly _data: ExcelJsonObject;

    constructor(data: ExcelJsonObject, enka: EnkaClient) {
        this._data = data;
        this.enka = enka;

        const json = new JsonReader(excelJsonOptions, this._data);

        this.id = json.getAsNumber("id");

        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this.icon = json.has("icon") ? new ImageAssets(json.getAsString("icon"), enka) : null;

        this.pictures = json.has("picPath") ? json.get("picPath").mapArray((_, name) => new ImageAssets(name.getAsString(), enka)) : [];

        this.itemType = json.getAsString("itemType") as ItemType;

        this.materialType = json.getAsStringWithDefault(null, "materialType");

        this.stars = json.getAsNumberWithDefault(null, "rankLevel");
    }

    static getMaterialByData(data: ExcelJsonObject, enka: EnkaClient): Material {
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
        const data = enka.cachedAssetsManager.getExcelData("MaterialExcelConfigData", id);
        if (!data) throw new AssetsNotFoundError("Material", id);

        return this.getMaterialByData(data, enka);
    }
}


export class NameCard extends Material {
    override readonly materialType: "MATERIAL_NAMECARD";

    constructor(data: ExcelJsonObject, enka: EnkaClient) {
        super(data, enka);
        this.materialType = "MATERIAL_NAMECARD";
    }

    static readonly MATERIAL_TYPE = "MATERIAL_NAMECARD";
}