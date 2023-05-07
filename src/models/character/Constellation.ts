import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import ImageAssets from "../assets/ImageAssets";
import TextAssets from "../assets/TextAssets";
import StatusProperty, { FightProp } from "../StatusProperty";

/**
 * @en Constellation
 */
class Constellation {
    /**  */
    readonly id: number;
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly name: TextAssets;
    /**  */
    readonly description: TextAssets;
    /**  */
    readonly icon: ImageAssets;
    /**  */
    readonly addProps: StatusProperty[];
    /**  */
    readonly paramList: number[];

    readonly _data: JsonObject;

    /**
     * @param id
     * @param enka
     */
    constructor(id: number, enka: EnkaClient) {

        this.id = id;

        this.enka = enka;

        const json = enka.cachedAssetsManager.getGenshinCacheData("AvatarTalentExcelConfigData").findArray((_, p) => p.getAsNumber("talentId") === this.id)?.[1];
        if (!json) throw new AssetsNotFoundError("Talent", this.id);
        this._data = json.getAsJsonObject();

        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this.icon = new ImageAssets(json.getAsString("icon"), enka);

        this.addProps = json.get("addProps").filterArray((_, p) => p.has("propType") && p.has("value")).map(([, p]) => new StatusProperty(p.getAsString("propType") as FightProp, p.getAsNumber("value"), enka));

        this.paramList = json.get("paramList").mapArray((_, p) => p.getAsNumber());
    }
}

export default Constellation;