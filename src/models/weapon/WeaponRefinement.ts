import { JsonObject } from "config_file.js";
import TextAssets from "../assets/TextAssets";
import StatusProperty from "../StatusProperty";
import EnkaClient from "../../client/EnkaClient";

/**
 * @en WeaponRefinement
 */
export default class WeaponRefinement {
    _data: JsonObject;
    enka: EnkaClient;
    level: number;
    name: TextAssets;
    description: TextAssets;
    addProps: StatusProperty[];
    paramList: number[];

    /**
     * @param {Object<string, any>} data
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(data: JsonObject, enka: EnkaClient) {
        this._data = data;

        this.enka = enka;

        /** @type {number} */
        this.level = (data.level ?? 0) as number + 1;

        /** @type {TextAssets} */
        this.name = new TextAssets(data.nameTextMapHash as number, enka);

        /** @type {TextAssets} */
        this.description = new TextAssets(data.descTextMapHash as number, enka);

        /** @type {Array<StatusProperty>} */
        this.addProps = (data.addProps as JsonObject[]).filter(p => Object.keys(p).includes("propType") && Object.keys(p).includes("value")).map(p => new StatusProperty(p.propType, p.value, enka));

        /** @type {Array<number>} */
        this.paramList = data.paramList as number[];
    }
}