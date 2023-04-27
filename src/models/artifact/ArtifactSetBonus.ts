import { JsonObject } from "config_file.js";
import TextAssets from "../assets/TextAssets";
import StatusProperty, { FightProp } from "../StatusProperty";
import EnkaClient from "../../client/EnkaClient";

/**
 * @en ArtifactSetBonus
 */
export default class ArtifactSetBonus {
    readonly enka: EnkaClient;
    readonly id: number;
    readonly needCount: number;
    readonly description: TextAssets;
    readonly addProps: StatusProperty[];
    readonly paramList: number[];

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
        this.addProps = (data.addProps as JsonObject[]).filter(p => Object.keys(p).includes("propType") && Object.keys(p).includes("value")).map(p => new StatusProperty(p.propType as FightProp, p.value as number, enka));

        /** @type {Array<number>} */
        this.paramList = data.paramList as number[];
    }
}