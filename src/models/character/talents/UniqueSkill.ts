import EnkaClient from "../../../client/EnkaClient";
import UpgradableSkill from "./UpgradableSkill";

/**
 * @en UniqueSkill
 * @extends {UpgradableSkill}
 * @description Elemental Skill and Elemental Burst
 */
export default class UniqueSkill extends UpgradableSkill {
    readonly maxCharge: number;
    readonly cooldown: number;

    constructor(id: number, enka: EnkaClient) {
        super(id, enka);

        /** @type {number} */
        this.maxCharge = (this._data.maxChargeNum ?? 1) as number;

        /** @type {number} */
        this.cooldown = this._data.cdTime as number;

    }
}