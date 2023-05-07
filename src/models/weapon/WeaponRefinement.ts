import { JsonReader, JsonObject } from "config_file.js";
import TextAssets from "../assets/TextAssets";
import StatusProperty, { FightProp } from "../StatusProperty";
import EnkaClient from "../../client/EnkaClient";

/**
 * @en WeaponRefinement
 */
class WeaponRefinement {
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly level: number;
    /**  */
    readonly name: TextAssets;
    /**  */
    readonly description: TextAssets;
    /**  */
    readonly addProps: StatusProperty[];
    /**  */
    readonly paramList: number[];

    readonly _data: JsonObject;

    /**
     * @param data
     * @param enka
     */
    constructor(data: JsonObject, enka: EnkaClient) {
        this._data = data;

        this.enka = enka;

        const json = new JsonReader(this._data);

        this.level = (json.has("level") ? json.getAsNumber("level") : 0) + 1;

        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this.addProps = json.get("addProps").filterArray((_, p) => p.has("propType") && p.has("value")).map(([, p]) => new StatusProperty(p.getAsString("propType") as FightProp, p.getAsNumber("value"), enka));

        this.paramList = json.get("paramList").mapArray((_, p) => p.getAsNumber());
    }
}

export default WeaponRefinement;