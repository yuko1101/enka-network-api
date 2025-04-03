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
            const materialId = cost.getAsNumberWithDefault(0, "id");
            if (materialId === 0) return null;
            const count = cost.getAsNumber("count");
            return {
                material: Material.getMaterialById(materialId, enka),
                count,
            };
        }).filter(nonNullable);
    }
}
