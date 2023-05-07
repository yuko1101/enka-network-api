import { JsonReader } from "config_file.js";
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

        const json = new JsonReader(this._data);

        this.maxCharge = json.getAsNumberWithDefault(1, "maxChargeNum");

        this.cooldown = json.getAsNumber("cdTime");

    }
}

export default UniqueSkill;