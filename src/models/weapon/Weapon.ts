import { JsonReader, JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import StatProperty, { FightProp } from "../StatProperty";
import WeaponData from "./WeaponData";
import WeaponRefinement from "./WeaponRefinement";

/**
 * @en Weapon
 */
class Weapon {
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly weaponData: WeaponData;
    /**  */
    readonly refinement: WeaponRefinement | null;
    /**  */
    readonly refinementRank: number;
    /**  */
    readonly level: number;
    /**  */
    readonly ascension: number;
    /**  */
    readonly maxLevel: number;
    /**  */
    readonly isAwaken: boolean;
    /**  */
    readonly weaponStats: StatProperty[];

    readonly _data: JsonObject;

    /**
     * @param data
     * @param enka
     */
    constructor(data: JsonObject, enka: EnkaClient) {

        this.enka = enka;

        this._data = data;

        const json = new JsonReader(this._data);

        this.weaponData = new WeaponData(json.getAsNumber("itemId"), enka);
        const weaponDataJson = new JsonReader(this.weaponData._data);

        const weapon = json.get("weapon");

        this.refinementRank = weapon.getAsNumberWithDefault(0, "affixMap", `${weaponDataJson.getAsNumber("skillAffix", 0)}`) + 1;

        this.refinement = this.weaponData.refinements[this.refinementRank - 1] ?? null;

        this.level = weapon.getAsNumber("level") as number;

        this.ascension = weapon.getAsNumberWithDefault(0, "promoteLevel");

        this.maxLevel = (this.ascension + 1) * 20 - (this.ascension > 1 ? (this.ascension - 1) * 10 : 0);

        this.isAwaken = this.ascension >= 2;

        this.weaponStats = json.get("flat", "weaponStats").mapArray((_, p) => new StatProperty(p.getAsString("appendPropId") as FightProp, p.getAsNumber("statValue"), enka, true));

    }
}

export default Weapon;