import ArtifactData from "./ArtifactData";
import ArtifactSplitSubstat from "./ArtifactSplitSubstat";
import StatusProperty from "../StatusProperty";
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
    enka: EnkaClient;
    _data: JsonObject;
    artifactData: ArtifactData;
    level: number;
    mainstat: StatusProperty;
    substats: SubstatsContainer;

    /**
     * @param {Object<string, any>} data
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(data: JsonObject, enka: EnkaClient) {

        /** @type {import("../../client/EnkaClient")} */
        this.enka = enka;

        /** @type {Object<string, any>} */
        this._data = data;


        /** @type {ArtifactData} */
        this.artifactData = new ArtifactData(data.itemId as number, enka);

        /** @type {number} */
        this.level = (data.reliquary as JsonObject).level as number;

        const flat = data.flat as JsonObject;
        const reliquaryMainstat = flat.reliquaryMainstat as JsonObject;

        /** @type {StatusProperty} */
        this.mainstat = new StatusProperty(reliquaryMainstat.mainPropId, reliquaryMainstat.statValue, enka, true);

        /** @type {SubstatsContainer} */
        this.substats = {
            total: (flat.reliquarySubstats as JsonObject[])?.map(obj => new StatusProperty(obj.appendPropId, obj.statValue, enka, true)) ?? [],
            split: ((data.reliquary as JsonObject).appendPropIdList as number[]).map(id => new ArtifactSplitSubstat(id, enka)) ?? [],
        };

    }
}