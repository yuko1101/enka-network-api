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

        const json = new JsonManager(this._data, true);

        this.artifactData = new ArtifactData(json.getAs<number>("itemId"), enka);

        this.level = json.get("reliquary").getAs<number>("level");

        this.mainstat = new StatusProperty(json.get("flat", "reliquaryMainstat").getAs<FightProp>("mainPropId"), json.get("flat", "reliquaryMainstat").getAs<number>("statValue"), enka, true);

        this.substats = {
            total: json.get("flat").getAs<JsonObject[] | undefined>("reliquarySubstats")?.map(obj => new StatusProperty(obj.appendPropId as FightProp, obj.statValue as number, enka, true)) ?? [],
            split: json.get("reliquary").getAs<number[] | undefined>("appendPropIdList")?.map(id => new ArtifactSplitSubstat(id, enka)) ?? [],
        };

    }
}

export default Artifact;