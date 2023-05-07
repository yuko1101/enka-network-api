import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import WeaponRefinement from "./WeaponRefinement";

/**
 * @en WeaponRefinements
 */
class WeaponRefinements {
    /**  */
    readonly id: number;
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly refinements: WeaponRefinement[];

    readonly _data: JsonObject[];

    /**
     * @param id
     * @param enka
     */
    constructor(id: number, enka: EnkaClient) {

        this.id = id;

        this.enka = enka;


        const json = enka.cachedAssetsManager.getGenshinCacheData("EquipAffixExcelConfigData").filter(p => p.getAsNumber("id") === this.id).sort((a, b) => (a.has("level") ? a.getAsNumber("level") : 0) - (b.has("level") ? b.getAsNumber("level") : 0));
        this._data = json.map(p => p.getAsJsonObject());

        this.refinements = json.map(r => new WeaponRefinement(r.getAsJsonObject(), enka));

    }
}

export default WeaponRefinements;