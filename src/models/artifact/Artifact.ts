import ArtifactData from "./ArtifactData";
import ArtifactSplitSubstat from "./ArtifactSplitSubstat";
import StatProperty, { FightProp } from "../StatProperty";
import { JsonReader, JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";

/**
 * @en SubstatsContainer
 * @typedef
 */
export interface SubstatsContainer {
    total: StatProperty[];
    split: ArtifactSplitSubstat[];
}

/**
 * @en Artifact
 */
class Artifact {
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly artifactData: ArtifactData;
    /**  */
    readonly level: number;
    /**  */
    readonly mainstat: StatProperty;
    /**  */
    readonly substats: SubstatsContainer;

    readonly _data: JsonObject;

    /**
     * @param data
     * @param enka
     */
    constructor(data: JsonObject, enka: EnkaClient) {

        this.enka = enka;

        this._data = data;

        const json = new JsonReader(this._data);

        const reliquary = json.get("reliquary");

        this.artifactData = ArtifactData.getById(json.getAsNumber("itemId"), enka);

        this.level = reliquary.getAsNumber("level");

        // const mainstatId = reliquary.getAsNumber("mainPropId");
        // const mainstatFightProp: FightProp = enka.cachedAssetsManager.getGenshinCacheData("ReliquaryMainPropExcelConfigData").findArray((_, m) => m.getAsNumber("id") === mainstatId)?.[1].getAsString("propType") as FightProp;
        const mainstatFightProp = json.getAsString("flat", "reliquaryMainstat", "mainPropId") as FightProp;
        const levelInfo = enka.cachedAssetsManager.getGenshinCacheData("ReliquaryLevelExcelConfigData").findArray((_, value) => value.getAsNumberWithDefault(0, "rank") === this.artifactData.stars && value.getAsNumber("level") === this.level)?.[1] as JsonReader;
        const mainstatData = levelInfo.get("addProps").findArray((_, p) => p.getAsString("propType") === mainstatFightProp)?.[1] as JsonReader;
        this.mainstat = new StatProperty(mainstatFightProp, mainstatData.getAsNumber("value"), enka);

        const splitSubStats = reliquary.has("appendPropIdList") ? reliquary.get("appendPropIdList")?.mapArray((_, id) => ArtifactSplitSubstat.getById(id.getAsNumber(), enka)) : [];

        this.substats = {
            total: StatProperty.sumStatProperties(splitSubStats, enka),
            split: splitSubStats,
        };

    }
}

export default Artifact;