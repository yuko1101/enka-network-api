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

        const flat = json.get("flat");
        const reliquary = json.get("reliquary");

        this.artifactData = ArtifactData.getById(json.getAsNumber("itemId"), enka);

        this.level = reliquary.getAsNumber("level");

        this.mainstat = new StatProperty(flat.getAsString("reliquaryMainstat", "mainPropId") as FightProp, flat.getAsNumber("reliquaryMainstat", "statValue"), enka, true);

        const splitSubStats = reliquary.has("appendPropIdList") ? reliquary.get("appendPropIdList")?.mapArray((_, id) => ArtifactSplitSubstat.getById(id.getAsNumber(), enka)) : [];

        this.substats = {
            total: StatProperty.sumStatProperties(splitSubStats, enka),
            split: splitSubStats,
        };

    }
}

export default Artifact;