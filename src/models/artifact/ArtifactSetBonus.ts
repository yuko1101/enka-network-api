import { JsonReader, JsonObject } from "config_file.js";
import TextAssets from "../assets/TextAssets";
import StatusProperty, { FightProp } from "../StatusProperty";
import EnkaClient from "../../client/EnkaClient";

/**
 * @en ArtifactSetBonus
 */
class ArtifactSetBonus {
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly id: number;
    /**  */
    readonly needCount: number;
    /**  */
    readonly description: TextAssets;
    /**  */
    readonly addProps: StatusProperty[];
    /**  */
    readonly paramList: number[];

    readonly _data: JsonObject;

    /**
     * @param needCount
     * @param data
     * @param enka
     */
    constructor(needCount: number, data: JsonObject, enka: EnkaClient) {
        this.enka = enka;

        this._data = data;

        const json = new JsonReader(this._data);

        this.id = json.getAsNumber("affixId");

        this.needCount = needCount;

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this.addProps = json.get("addProps").filterArray((_, p) => p.has("propType") && p.has("value")).map(([, p]) => new StatusProperty(p.getAsString("propType") as FightProp, p.getAsNumber("value"), enka));

        this.paramList = json.get("paramList").mapArray((_, p) => p.getAsNumber());
    }
}

export default ArtifactSetBonus;