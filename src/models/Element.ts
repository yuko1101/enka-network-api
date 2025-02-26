import { JsonObject, JsonReader } from "config_file.js";
import { EnkaClient } from "../client/EnkaClient";
import { AssetsNotFoundError } from "../errors/AssetsNotFoundError";
import { TextAssets } from "./assets/TextAssets";
import { excelJsonOptions } from "../client/CachedAssetsManager";

export const elementList = [null, "Fire", "Water", "Grass", "Electric", "Ice", null, "Wind", "Rock"] as const satisfies (ElementType | null)[];

export class Element {
    readonly id: ElementType;
    readonly enka: EnkaClient;
    readonly name: TextAssets;

    readonly _data: JsonObject;

    constructor(data: JsonObject, enka: EnkaClient) {
        this._data = data;
        this.enka = enka;

        const json = new JsonReader(excelJsonOptions, this._data);

        this.id = json.getAsString("textMapId") as ElementType;

        this.name = new TextAssets(json.getAsNumber("textMapContentTextMapHash"), enka);
    }

    static getByElementType(elementType: ElementType, enka: EnkaClient): Element {
        const json = enka.cachedAssetsManager.getGenshinCacheData("ManualTextMapConfigData").findArray((_, p) => p.getAsString("textMapId") === elementType)?.[1];
        if (!json) throw new AssetsNotFoundError("Element", elementType);
        return new Element(json.getAsJsonObject(), enka);
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