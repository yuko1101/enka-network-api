import { JsonObject } from "config_file.js";
import TextAssets from "../assets/TextAssets";
import StatusProperty, { FightProp } from "../StatusProperty";
import EnkaClient from "../../client/EnkaClient";

/**
 * @en ArtifactSetBonus
 */
class ArtifactSetBonus {
    readonly enka: EnkaClient;
    readonly id: number;
    readonly needCount: number;
    readonly description: TextAssets;
    readonly addProps: StatusProperty[];
    readonly paramList: number[];

    constructor(needCount: number, data: JsonObject, enka: EnkaClient) {
        this.enka = enka;

        this.id = data.affixId as number;

        this.needCount = needCount;

        this.description = new TextAssets(data.descTextMapHash as number, enka);

        this.addProps = (data.addProps as JsonObject[]).filter(p => Object.keys(p).includes("propType") && Object.keys(p).includes("value")).map(p => new StatusProperty(p.propType as FightProp, p.value as number, enka));

        this.paramList = data.paramList as number[];
    }
}

export default ArtifactSetBonus;