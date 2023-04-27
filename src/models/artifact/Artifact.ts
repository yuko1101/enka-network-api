import ArtifactData from "./ArtifactData";
import ArtifactSplitSubstat from "./ArtifactSplitSubstat";
import StatusProperty, { FightProp } from "../StatusProperty";
import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";

/**
 * @en SubstatsContainer
 * @typedef SubstatsContainer
 * @type {object}
 * @property {Array<StatusProperty>} total
 * @property {Array<ArtifactSplitSubstat>} split
 */
export type SubstatsContainer = {
    total: StatusProperty[],
    split: ArtifactSplitSubstat[]
};

/**
 * @en Artifact
 */
export default class Artifact {
    readonly enka: EnkaClient;
    readonly _data: JsonObject;
    readonly artifactData: ArtifactData;
    readonly level: number;
    readonly mainstat: StatusProperty;
    readonly substats: SubstatsContainer;

    constructor(data: JsonObject, enka: EnkaClient) {

        this.enka = enka;

        this._data = data;

        this.artifactData = new ArtifactData(data.itemId as number, enka);

        this.level = (data.reliquary as JsonObject).level as number;

        const flat = data.flat as JsonObject;
        const reliquaryMainstat = flat.reliquaryMainstat as JsonObject;

        this.mainstat = new StatusProperty(reliquaryMainstat.mainPropId as FightProp, reliquaryMainstat.statValue as number, enka, true);

        this.substats = {
            total: (flat.reliquarySubstats as JsonObject[])?.map(obj => new StatusProperty(obj.appendPropId as FightProp, obj.statValue as number, enka, true)) ?? [],
            split: ((data.reliquary as JsonObject).appendPropIdList as number[]).map(id => new ArtifactSplitSubstat(id, enka)) ?? [],
        };

    }
}