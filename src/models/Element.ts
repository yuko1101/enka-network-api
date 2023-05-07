import { JsonObject } from "config_file.js";
import EnkaClient from "../client/EnkaClient";
import AssetsNotFoundError from "../errors/AssetsNotFoundError";
import TextAssets from "./assets/TextAssets";

/**
 * @en Element
 */
class Element {
    /**  */
    readonly id: ElementType;
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly name: TextAssets;

    readonly _data: JsonObject;

    /**
     * @param id
     * @param enka
     */
    constructor(id: ElementType, enka: EnkaClient) {

        this.id = id;

        this.enka = enka;

        const json = enka.cachedAssetsManager.getGenshinCacheData("ManualTextMapConfigData").findArray((_, p) => p.getAsString("textMapId") === this.id)?.[1];
        if (!json) throw new AssetsNotFoundError("Element", this.id);
        this._data = json.getAsJsonObject();

        this.name = new TextAssets(json.getAsNumber("textMapContentTextMapHash"), enka);
    }
}

export default Element;

/**
 * @en ElementType
 * @typedef
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