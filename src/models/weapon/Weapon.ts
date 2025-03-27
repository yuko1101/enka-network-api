import { JsonObject, JsonReader, defaultJsonOptions } from "config_file.js";
import { EnkaClient } from "../../client/EnkaClient";
import { StatProperty } from "../StatProperty";
import { WeaponData } from "./WeaponData";
import { WeaponRefinement } from "./WeaponRefinement";
import { IGOODComponentResolvable, convertToGOODKey } from "../good/IGOODResolvable";
import { CharacterKey, IWeapon } from "../good/GOOD";
import { excelJsonOptions } from "../../client/ExcelTransformer";

export class Weapon implements IGOODComponentResolvable<IWeapon> {
    readonly enka: EnkaClient;
    readonly weaponData: WeaponData;
    readonly refinement: WeaponRefinement | null;
    readonly refinementRank: number;
    readonly level: number;
    readonly ascension: number;
    readonly maxLevel: number;
    readonly isAwaken: boolean;
    readonly weaponStats: StatProperty[];

    /** The name of character who has this weapon for the GOOD. */
    location: CharacterKey | null = null;

    readonly _data: JsonObject;

    constructor(data: JsonObject, enka: EnkaClient) {

        this.enka = enka;

        this._data = data;

        const json = new JsonReader(defaultJsonOptions, this._data);

        this.weaponData = WeaponData.getById(json.getAsNumber("itemId"), enka);
        const weaponDataJson = new JsonReader(excelJsonOptions, this.weaponData._data);

        const weapon = json.get("weapon");

        this.refinementRank = weapon.getAsNumberWithDefault(0, "affixMap", `${weaponDataJson.getAsNumberWithDefault(0, "skillAffix", 0)}`) + 1;

        this.refinement = this.weaponData.refinements[this.refinementRank - 1] ?? null;

        this.level = weapon.getAsNumber("level") as number;

        this.ascension = weapon.getAsNumberWithDefault(0, "promoteLevel");

        this.maxLevel = (this.ascension + 1) * 20 - (this.ascension > 1 ? (this.ascension - 1) * 10 : 0);

        this.isAwaken = this.ascension >= 2;

        this.weaponStats = this.weaponData.getStats(this.ascension, this.level);

    }

    /** `lock` is always false since enka.network cannot get the lock state from the game. */
    toGOOD(): IWeapon {
        return {
            key: convertToGOODKey(this.weaponData.name.get("en")),
            level: this.level,
            ascension: this.ascension,
            refinement: Math.max(this.refinementRank, 1),
            location: this.location ?? "",
            lock: false,
        };
    }
}
