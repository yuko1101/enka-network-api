import { JsonReader } from "config_file.js";
import { EnkaClient } from "../../client/EnkaClient";
import { AssetsNotFoundError } from "../../errors/AssetsNotFoundError";
import { ImageAssets } from "../assets/ImageAssets";
import { TextAssets } from "../assets/TextAssets";
import { StatProperty, FightProp } from "../StatProperty";
import { ExcelJsonObject, excelJsonOptions } from "../../client/ExcelTransformer";

export class Constellation {
    readonly id: number;
    readonly enka: EnkaClient;
    readonly name: TextAssets;
    readonly description: TextAssets;
    readonly icon: ImageAssets;
    readonly addProps: StatProperty[];
    readonly paramList: number[];

    readonly _data: ExcelJsonObject;

    constructor(data: ExcelJsonObject, enka: EnkaClient) {
        this.enka = enka;
        this._data = data;

        const json = new JsonReader(excelJsonOptions, data);

        this.id = json.getAsNumber("talentId");

        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this.icon = new ImageAssets(json.getAsString("icon"), enka);

        this.addProps = json.get("addProps").filterArray((_, p) => p.has("propType") && p.has("value")).map(([, p]) => new StatProperty(p.getAsString("propType") as FightProp, p.getAsNumber("value"), enka));

        this.paramList = json.has("paramList") ? json.get("paramList").mapArray((_, p) => p.getAsNumber()) : [];
    }

    static getById(id: number, enka: EnkaClient): Constellation {
        const data = enka.cachedAssetsManager.getExcelData("AvatarTalentExcelConfigData", id);
        if (!data) throw new AssetsNotFoundError("Constellation", id);
        return new Constellation(data, enka);
    }
}
