import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import StatusProperty from "../StatusProperty";

/**
 * @en ArtifactSplitSubstat
 * @extends {StatusProperty}
 */
export default class ArtifactSplitSubstat extends StatusProperty {
    public _data: JsonObject;

    /**
     * @param {number} id
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(id: number, enka: EnkaClient) {
        const data: JsonObject | undefined = enka.cachedAssetsManager.getGenshinCacheData("ReliquaryAffixExcelConfigData").find(a => a.id === id);
        if (!data) throw new AssetsNotFoundError("Artifact Substat", id);

        super(data.propType, data.propValue, enka);

        this._data = data;
    }
}