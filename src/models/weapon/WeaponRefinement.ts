import { JsonReader } from "config_file.js";
import { TextAssets } from "../assets/TextAssets";
import { StatProperty, FightProp } from "../StatProperty";
import { EnkaClient } from "../../client/EnkaClient";
import { AssetsNotFoundError } from "../../errors/AssetsNotFoundError";
import { ExcelJsonObject, excelJsonOptions } from "../../client/ExcelTransformer";

export class WeaponRefinement {
    readonly enka: EnkaClient;
    readonly id: number;
    readonly level: number;

    readonly name: TextAssets;
    readonly description: TextAssets;
    readonly addProps: StatProperty[];
    readonly paramList: number[];

    readonly _data: ExcelJsonObject;

    constructor(data: ExcelJsonObject, enka: EnkaClient) {
        this._data = data;

        this.enka = enka;

        const json = new JsonReader(excelJsonOptions, this._data);

        this.id = json.getAsNumber("id");
        this.level = json.getAsNumberWithDefault(0, "level") + 1;

        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this.addProps = json.get("addProps").filterArray((_, p) => p.has("propType") && p.has("value")).map(([, p]) => new StatProperty(p.getAsString("propType") as FightProp, p.getAsNumber("value"), enka));

        this.paramList = json.get("paramList").mapArray((_, p) => p.getAsNumber());
    }

    /**
     * @param level refinement rank (1-5)
     */
    static getById(id: number, level: number, enka: EnkaClient): WeaponRefinement {
        const data = enka.cachedAssetsManager.getExcelData("EquipAffixExcelConfigData", id, level);
        if (!data) throw new AssetsNotFoundError("WeaponRefinement", id);
        return new WeaponRefinement(data, enka);
    }
}
