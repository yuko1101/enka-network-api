import ArtifactData from "./ArtifactData";
import ArtifactSplitSubstat from "./ArtifactSplitSubstat";
import StatusProperty, { FightProp } from "../StatusProperty";
import { JsonManager, JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";

/**
 * @en SubstatsContainer
 * @typedef
 */
export interface SubstatsContainer {
    total: StatusProperty[];
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
    readonly mainstat: StatusProperty;
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

        const json = new JsonManager(this._data, true, true);

        const flat = json.get("flat").detach();
        const reliquary = json.get("reliquary").detach();

        this.artifactData = new ArtifactData(json.getAsNumber("itemId"), enka);

        this.level = reliquary.getAsNumber("level");

        this.mainstat = new StatusProperty(flat.get("reliquaryMainstat").getAsString("mainPropId") as FightProp, flat.get("reliquaryMainstat").getAsNumber("statValue"), enka, true);

        this.substats = {
            total: flat.has("reliquarySubstats") ? flat.get("reliquarySubstats").map(p => new StatusProperty(p.getAsString("appendPropId") as FightProp, p.getAsNumber("statValue"), enka, true)) : [],
            split: reliquary.has("appendPropIdList") ? reliquary.get("appendPropIdList")?.map(id => new ArtifactSplitSubstat(id.getAsNumber(), enka)) : [],
        };

    }
}

export default Artifact;