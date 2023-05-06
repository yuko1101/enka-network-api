import { JsonManager } from "config_file.js";
import EnkaClient from "../../../client/EnkaClient";
import UpgradableSkill from "./UpgradableSkill";

/**
 * Elemental Skill and Elemental Burst
 * @en UniqueSkill
 * @extends {UpgradableSkill}
 */
class UniqueSkill extends UpgradableSkill {
    /**  */
    readonly maxCharge: number;
    /**  */
    readonly cooldown: number;

    /**
     * @param id
     * @param enka
     */
    constructor(id: number, enka: EnkaClient) {
        super(id, enka);

        const json = new JsonManager(this._data, true, true);

        this.maxCharge = json.has("maxChargeNum") ? json.getAsNumber("maxChargeNum") : 1;

        this.cooldown = json.getAsNumber("cdTime");

    }
}

export default UniqueSkill;