import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import StatusProperty, { FightProp } from "../StatusProperty";

/**
 * @en ArtifactSplitSubstat
 * @extends {StatusProperty}
 */
class ArtifactSplitSubstat extends StatusProperty {
    readonly _data: JsonObject;

    /**
     * @param id
     * @param enka
     */
    constructor(id: number, enka: EnkaClient) {
        const json = enka.cachedAssetsManager.getGenshinCacheData("ReliquaryAffixExcelConfigData").find(p => p.getAsNumber("id") === id)?.detach();
        if (!json) throw new AssetsNotFoundError("Artifact Substat", id);

        super(json.getAsString("propType") as FightProp, json.getAsNumber("propValue"), enka);

        this._data = json.getAsJsonObject();
    }
}

export default ArtifactSplitSubstat;