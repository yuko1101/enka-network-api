import { JsonReader } from "config_file.js";
import { EnkaClient } from "../client/EnkaClient";
import { AssetsNotFoundError } from "../errors/AssetsNotFoundError";
import { TextAssets } from "./assets/TextAssets";
import { ExcelJsonObject, excelJsonOptions } from "../client/ExcelTransformer";

export const elementList = [null, "Fire", "Water", "Grass", "Electric", "Ice", null, "Wind", "Rock"] as const satisfies (ElementType | null)[];

export class Element {
    readonly id: ElementType;
    readonly enka: EnkaClient;
    readonly name: TextAssets;

    readonly _data: ExcelJsonObject;

    constructor(data: ExcelJsonObject, enka: EnkaClient) {
        this._data = data;
        this.enka = enka;

        const json = new JsonReader(excelJsonOptions, this._data);

        this.id = json.getAsString("textMapId") as ElementType;

        this.name = new TextAssets(json.getAsNumber("textMapContentTextMapHash"), enka);
    }

    static getByElementType(elementType: ElementType, enka: EnkaClient): Element {
        const data = enka.cachedAssetsManager.getExcelData("ManualTextMapConfigData", elementType);
        if (!data) throw new AssetsNotFoundError("Element", elementType);
        return new Element(data, enka);
    }
}


/**
 * ElementType|In-game Name
 * ---|---
 * Wind|Anemo
 * Rock|Geo
 * Electric|Electro
 * Grass|Dendro
 * Water|Hydro
 * Fire|Pyro
 * Ice|Cryo
 */
export type ElementType = "Wind" | "Rock" | "Electric" | "Grass" | "Water" | "Fire" | "Ice";