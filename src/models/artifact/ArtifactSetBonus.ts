import { JsonReader } from "config_file.js";
import { TextAssets } from "../assets/TextAssets";
import { StatProperty } from "../StatProperty";
import { EnkaClient } from "../../client/EnkaClient";
import { ExcelJsonObject, excelJsonOptions } from "../../client/ExcelTransformer";

export class ArtifactSetBonus {
    readonly enka: EnkaClient;
    readonly id: number;
    readonly needCount: number;
    readonly description: TextAssets;
    readonly addProps: StatProperty[];
    readonly paramList: number[];

    readonly _data: ExcelJsonObject;

    constructor(needCount: number, data: ExcelJsonObject, enka: EnkaClient) {
        this.enka = enka;

        this._data = data;

        const json = new JsonReader(excelJsonOptions, this._data);

        this.id = json.getAsNumber("affixId");

        this.needCount = needCount;

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this.addProps = StatProperty.parseAddProps(json.get("addProps"), enka);

        this.paramList = json.has("paramList") ? json.get("paramList").mapArray((_, p) => p.getAsNumber()) : [];
    }
}
