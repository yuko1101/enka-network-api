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

        this.maxCharge = (this._data.maxChargeNum ?? 1) as number;

        this.cooldown = this._data.cdTime as number;

    }
}

export default UniqueSkill;