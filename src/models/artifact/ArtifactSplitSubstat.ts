import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import StatProperty, { FightProp } from "../StatProperty";

/**
 * @en ArtifactSplitSubstat
 * @extends {StatProperty}
 */
class ArtifactSplitSubstat extends StatProperty {
    readonly _data: JsonObject;

    /**
     * @param id
     * @param enka
     */
    constructor(id: number, enka: EnkaClient) {
        const json = enka.cachedAssetsManager.getGenshinCacheData("ReliquaryAffixExcelConfigData").findArray((_, p) => p.getAsNumber("id") === id)?.[1];
        if (!json) throw new AssetsNotFoundError("Artifact Substat", id);

        super(json.getAsString("propType") as FightProp, json.getAsNumber("propValue"), enka);

        this._data = json.getAsJsonObject();
    }
}

export default ArtifactSplitSubstat;