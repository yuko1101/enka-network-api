import UpgradableSkill from "./UpgradableSkill";

/**
 * @en UniqueSkill
 * @extends {UpgradableSkill}
 * @description Elemental Skill and Elemental Burst
 */
export default class UniqueSkill extends UpgradableSkill {

    /**
     * @param {number} id
     * @param {import("../../../client/EnkaClient")} enka
     */
    constructor(id, enka) {
        super(id, enka);

        /** @type {number} */
        this.maxCharge = this._data.maxChargeNum ?? 0;

        /** @type {number} */
        this.cooldown = this._data.cdTime;

    }
}