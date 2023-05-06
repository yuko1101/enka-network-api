import { JsonManager, JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import StatusProperty, { FightProp } from "../StatusProperty";
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
    readonly weaponStats: StatusProperty[];

    readonly _data: JsonObject;

    /**
     * @param data
     * @param enka
     */
    constructor(data: JsonObject, enka: EnkaClient) {

        this.enka = enka;

        this._data = data;

        const json = new JsonManager(this._data, true, true);

        this.weaponData = new WeaponData(json.getAsNumber("itemId"), enka);
        const weaponDataJson = new JsonManager(this.weaponData._data, true, true);

        const weapon = json.get("weapon");

        this.refinementRank = (weapon.get("affixMap", `${weaponDataJson.get("skillAffix", 0).getAsNumber()}`).getAsNumber() ?? 0) + 1;

        this.refinement = this.weaponData.refinements[this.refinementRank - 1] ?? null;

        this.level = weapon.getAsNumber("level") as number;

        this.ascension = weapon.has("promoteLevel") ? weapon.getAsNumber("promoteLevel") : 0;

        this.maxLevel = (this.ascension + 1) * 20 - (this.ascension > 1 ? (this.ascension - 1) * 10 : 0);

        this.isAwaken = this.ascension >= 2;

        this.weaponStats = json.get("flat", "weaponStats").map(p => new StatusProperty(p.getAsString("appendPropId") as FightProp, p.getAsNumber("statValue"), enka, true));

    }
}

export default Weapon;