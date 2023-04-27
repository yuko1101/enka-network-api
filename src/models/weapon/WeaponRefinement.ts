import { JsonObject } from "config_file.js";
import TextAssets from "../assets/TextAssets";
import StatusProperty, { FightProp } from "../StatusProperty";
import EnkaClient from "../../client/EnkaClient";

/**
 * @en WeaponRefinement
 */
export default class WeaponRefinement {
    readonly _data: JsonObject;
    readonly enka: EnkaClient;
    readonly level: number;
    readonly name: TextAssets;
    readonly description: TextAssets;
    readonly addProps: StatusProperty[];
    readonly paramList: number[];

    constructor(data: JsonObject, enka: EnkaClient) {
        this._data = data;

        this.enka = enka;

        this.level = (data.level ?? 0) as number + 1;

        this.name = new TextAssets(data.nameTextMapHash as number, enka);

        this.description = new TextAssets(data.descTextMapHash as number, enka);

        this.addProps = (data.addProps as JsonObject[]).filter(p => Object.keys(p).includes("propType") && Object.keys(p).includes("value")).map(p => new StatusProperty(p.propType as FightProp, p.value as number, enka));

        this.paramList = data.paramList as number[];
    }
}