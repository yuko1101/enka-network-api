import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import WeaponRefinement from "./WeaponRefinement";

/**
 * @en WeaponRefinements
 */
class WeaponRefinements {
    readonly id: number;
    readonly enka: EnkaClient;
    readonly _data: JsonObject[];
    readonly refinements: WeaponRefinement[];

    constructor(id: number, enka: EnkaClient) {

        this.id = id;

        this.enka = enka;


        this._data = enka.cachedAssetsManager.getGenshinCacheData("EquipAffixExcelConfigData").filter(a => a.id === id).sort((a, b) => (a.level as number) - (b.level as number));

        this.refinements = this._data.map(r => new WeaponRefinement(r, enka));

    }
}

export default WeaponRefinements;