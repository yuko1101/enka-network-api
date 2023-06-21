import { JsonObject, JsonReader } from "config_file.js";
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
     * @param data
     * @param enka
     */
    constructor(data: JsonObject, enka: EnkaClient) {
        super(data, enka);

        const json = new JsonReader(this._data);

        this.maxCharge = json.getAsNumberWithDefault(1, "maxChargeNum");

        this.cooldown = json.getAsNumber("cdTime");

    }

    /**
     * @param id
     * @param enka
     */
    static getById(id: number, enka: EnkaClient): UniqueSkill {
        return new UniqueSkill(this._getJsonObjectById(id, enka), enka);
    }
}

export default UniqueSkill;