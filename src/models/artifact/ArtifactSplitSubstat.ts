import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import StatusProperty, { FightProp } from "../StatusProperty";

/**
 * @en ArtifactSplitSubstat
 * @extends {StatusProperty}
 */
export default class ArtifactSplitSubstat extends StatusProperty {
    readonly _data: JsonObject;

    constructor(id: number, enka: EnkaClient) {
        const data: JsonObject | undefined = enka.cachedAssetsManager.getGenshinCacheData("ReliquaryAffixExcelConfigData").find(a => a.id === id);
        if (!data) throw new AssetsNotFoundError("Artifact Substat", id);

        super(data.propType as FightProp, data.propValue as number, enka);

        this._data = data;
    }
}