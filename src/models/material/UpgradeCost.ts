import { JsonReader } from "config_file.js";
import { Material } from "./Material";
import { EnkaClient } from "../../client/EnkaClient";
import { nonNullable } from "../../utils/ts_utils";
import { ExcelJsonObject, excelJsonOptions } from "../../client/ExcelTransformer";

export class UpgradeCost {
    readonly enka: EnkaClient;
    readonly coin: number;
    readonly items: { material: Material, count: number }[];

    constructor(coinCost: number, costItems: ExcelJsonObject[], enka: EnkaClient) {
        this.enka = enka;

        this.coin = coinCost;

        const itemsJson = new JsonReader(excelJsonOptions, costItems);

        this.items = itemsJson.mapArray((_, cost) => {
            if (!cost.has("id")) return null;
            return {
                material: Material.getMaterialById(cost.getAsNumber("id"), enka),
                count: cost.getAsNumber("count"),
            };
        }).filter(nonNullable);
    }
}
