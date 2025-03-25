import { JsonReader } from "config_file.js";
import { EnkaClient } from "../../client/EnkaClient";
import { AssetsNotFoundError } from "../../errors/AssetsNotFoundError";
import { StatProperty, FightProp } from "../StatProperty";
import { ExcelJsonObject, excelJsonOptions } from "../../client/ExcelTransformer";

export class ArtifactSplitSubstat extends StatProperty {
    readonly _data: ExcelJsonObject;

    constructor(data: ExcelJsonObject, enka: EnkaClient) {
        const json = new JsonReader(excelJsonOptions, data);
        super(json.getAsString("propType") as FightProp, json.getAsNumber("propValue"), enka);

        this._data = json.getAsJsonObject();
    }

    static getById(id: number, enka: EnkaClient): ArtifactSplitSubstat {
        const data = enka.cachedAssetsManager.getExcelData("ReliquaryAffixExcelConfigData", id);
        if (!data) throw new AssetsNotFoundError("Artifact Substat", id);
        return new ArtifactSplitSubstat(data, enka);
    }
}
