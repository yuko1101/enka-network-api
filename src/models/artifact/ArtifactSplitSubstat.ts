import { JsonObject, JsonReader } from "config_file.js";
import { EnkaClient } from "../../client/EnkaClient";
import { AssetsNotFoundError } from "../../errors/AssetsNotFoundError";
import { StatProperty, FightProp } from "../StatProperty";
import { excelJsonOptions } from "../../client/CachedAssetsManager";

export class ArtifactSplitSubstat extends StatProperty {
    readonly _data: JsonObject;

    constructor(data: JsonObject, enka: EnkaClient) {
        const json = new JsonReader(excelJsonOptions, data);
        super(json.getAsString("propType") as FightProp, json.getAsNumber("propValue"), enka);

        this._data = json.getAsJsonObject();
    }

    static getById(id: number, enka: EnkaClient): ArtifactSplitSubstat {
        const json = enka.cachedAssetsManager.getGenshinCacheData("ReliquaryAffixExcelConfigData").findArray((_, p) => p.getAsNumber("id") === id)?.[1];
        if (!json) throw new AssetsNotFoundError("Artifact Substat", id);
        return new ArtifactSplitSubstat(json.getAsJsonObject(), enka);
    }

}
