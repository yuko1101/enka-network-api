import { JsonObject } from "config_file.js";
import TextAssets from "../assets/TextAssets";
import StatusProperty from "../StatusProperty";
import EnkaClient from "../../client/EnkaClient";

/**
 * @en ArtifactSetBonus
 */
export default class ArtifactSetBonus {
    enka: EnkaClient;
    id: number;
    needCount: number;
    description: TextAssets;
    addProps: StatusProperty[];
    paramList: number[];
    /**
     * @param {number} needCount
     * @param {Object<string, any>} data
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(needCount: number, data: JsonObject, enka: EnkaClient) {
        /** @type {import("../../client/EnkaClient")} */
        this.enka = enka;

        /** @type {number} */
        this.id = data.affixId as number;

        /** @type {number} */
        this.needCount = needCount;

        /** @type {TextAssets} */
        this.description = new TextAssets(data.descTextMapHash as number, enka);

        /** @type {Array<StatusProperty>} */
        this.addProps = (data.addProps as JsonObject[]).filter(p => Object.keys(p).includes("propType") && Object.keys(p).includes("value")).map(p => new StatusProperty(p.propType, p.value, enka));

        /** @type {Array<number>} */
        this.paramList = data.paramList as number[];
    }
}