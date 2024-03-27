import { JsonObject, JsonReader } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import ImageAssets from "../assets/ImageAssets";
import TextAssets from "../assets/TextAssets";
import StatProperty, { FightProp } from "../StatProperty";

class Constellation {
    readonly id: number;
    readonly enka: EnkaClient;
    readonly name: TextAssets;
    readonly description: TextAssets;
    readonly icon: ImageAssets;
    readonly addProps: StatProperty[];
    readonly paramList: number[];

    readonly _data: JsonObject;

    constructor(data: JsonObject, enka: EnkaClient) {
        this.enka = enka;
        this._data = data;

        const json = new JsonReader(data);

        this.id = json.getAsNumber("talentId");

        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this.icon = new ImageAssets(json.getAsString("icon"), enka);

        this.addProps = json.get("addProps").filterArray((_, p) => p.has("propType") && p.has("value")).map(([, p]) => new StatProperty(p.getAsString("propType") as FightProp, p.getAsNumber("value"), enka));

        this.paramList = json.get("paramList").mapArray((_, p) => p.getAsNumber());
    }

    static getById(id: number, enka: EnkaClient): Constellation {
        const json = enka.cachedAssetsManager.getGenshinCacheData("AvatarTalentExcelConfigData").findArray((_, p) => p.getAsNumber("talentId") === id)?.[1];
        if (!json) throw new AssetsNotFoundError("Constellation", id);
        return new Constellation(json.getAsJsonObject(), enka);
    }
}

export default Constellation;