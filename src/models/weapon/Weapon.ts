import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import StatusProperty, { FightProp } from "../StatusProperty";
import WeaponData from "./WeaponData";
import WeaponRefinement from "./WeaponRefinement";

/**
 * @en Weapon
 */
export default class Weapon {
    readonly enka: EnkaClient;
    readonly _data: JsonObject;
    readonly weaponData: WeaponData;
    readonly refinement: WeaponRefinement | null;
    readonly refinementRank: number;
    readonly level: number;
    readonly ascension: number;
    readonly maxLevel: number;
    readonly isAwaken: boolean;
    readonly weaponStats: StatusProperty[];

    constructor(data: JsonObject, enka: EnkaClient) {

        this.enka = enka;

        this._data = data;


        this.weaponData = new WeaponData(data.itemId as number, enka);

        const weapon = data.weapon as JsonObject;

        this.refinement = this.weaponData.refinements[((weapon.affixMap as JsonObject | undefined)?.[(this.weaponData._data.skillAffix as number[])[0]] ?? 0) as number] ?? null;

        this.refinementRank = this.refinement?.level ?? 1;

        this.level = weapon.level as number;

        this.ascension = (weapon.promoteLevel ?? 0) as number;

        this.maxLevel = (this.ascension + 1) * 20 - (this.ascension > 1 ? (this.ascension - 1) * 10 : 0);

        this.isAwaken = this.ascension >= 2;

        const flat = data.flat as JsonObject;

        this.weaponStats = (flat.weaponStats as JsonObject[]).map(obj => new StatusProperty(obj.appendPropId as FightProp, obj.statValue as number, enka, true));

    }
}