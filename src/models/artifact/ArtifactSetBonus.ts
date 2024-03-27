import { JsonReader, JsonObject } from "config_file.js";
import TextAssets from "../assets/TextAssets";
import StatProperty, { FightProp } from "../StatProperty";
import EnkaClient from "../../client/EnkaClient";

class ArtifactSetBonus {
    readonly enka: EnkaClient;
    readonly id: number;
    readonly needCount: number;
    readonly description: TextAssets;
    readonly addProps: StatProperty[];
    readonly paramList: number[];

    readonly _data: JsonObject;

    constructor(needCount: number, data: JsonObject, enka: EnkaClient) {
        this.enka = enka;

        this._data = data;

        const json = new JsonReader(this._data);

        this.id = json.getAsNumber("affixId");

        this.needCount = needCount;

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this.addProps = json.get("addProps").filterArray((_, p) => p.has("propType") && p.has("value")).map(([, p]) => new StatProperty(p.getAsString("propType") as FightProp, p.getAsNumber("value"), enka));

        this.paramList = json.get("paramList").mapArray((_, p) => p.getAsNumber());
    }
}

export default ArtifactSetBonus;