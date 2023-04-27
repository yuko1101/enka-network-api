import { JsonObject } from "config_file.js";
import EnkaClient from "../client/EnkaClient";
import AssetsNotFoundError from "../errors/AssetsNotFoundError";
import TextAssets from "./assets/TextAssets";

/**
 * @en Element
 */
export default class Element {
    readonly id: ElementType;
    readonly enka: EnkaClient;
    readonly _data: JsonObject;
    readonly name: TextAssets;

    constructor(id: ElementType, enka: EnkaClient) {

        this.id = id;

        this.enka = enka;

        const _data: JsonObject | undefined = enka.cachedAssetsManager.getGenshinCacheData("ManualTextMapConfigData").find(t => t.textMapId === id);
        if (!_data) throw new AssetsNotFoundError("Element", id);
        this._data = _data;

        this.name = new TextAssets(this._data.textMapContentTextMapHash as number, enka);
    }
}

/**
 * @en ElementType
 * @example
 * |ElementType|In-game Name|
 * |---|---|
 * |Wind|Anemo|
 * |Rock|Geo|
 * |Electric|Electro|
 * |Grass|Dendro|
 * |Water|Hydro|
 * |Fire|Pyro|
 * |Ice|Cryo|
 */
export type ElementType = "Wind" | "Rock" | "Electric" | "Grass" | "Water" | "Fire" | "Ice";