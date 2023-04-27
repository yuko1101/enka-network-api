import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import StatusProperty from "../StatusProperty";
import WeaponData from "./WeaponData";
import WeaponRefinement from "./WeaponRefinement";

/**
 * @en Weapon
 */
export default class Weapon {
    public enka: EnkaClient;
    public _data: JsonObject;
    public weaponData: WeaponData;
    public refinement: WeaponRefinement | null;
    public refinementRank: number;
    public level: number;
    public ascension: number;
    public maxLevel: number;
    public isAwaken: boolean;
    public weaponStats: StatusProperty[];

    /**
     * @param {Object<string, any>} data
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(data: JsonObject, enka: EnkaClient) {

        this.enka = enka;

        this._data = data;


        this.weaponData = new WeaponData(data.itemId, enka);

        /** @type {import("./WeaponRefinement") | null} */
        this.refinement = this.weaponData.refinements[data.weapon.affixMap?.[this.weaponData._data.skillAffix[0]] ?? 0] ?? null;

        /** @type {number} */
        this.refinementRank = this.refinement?.level ?? 1;

        /** @type {number} */
        this.level = (data.weapon as JsonObject).level as number;

        /** @type {number} */
        this.ascension = ((data.weapon as JsonObject).promoteLevel ?? 0) as number;

        /** @type {number} */
        this.maxLevel = (this.ascension + 1) * 20 - (this.ascension > 1 ? (this.ascension - 1) * 10 : 0);

        /** @type {boolean} */
        this.isAwaken = this.ascension >= 2;

        const flat = data.flat as JsonObject;

        /** @type {Array<StatusProperty>} */
        this.weaponStats = (flat.weaponStats as JsonObject[]).map(obj => new StatusProperty(obj.appendPropId, obj.statValue, enka, true));

    }
}