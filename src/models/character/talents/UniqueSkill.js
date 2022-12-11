const EnkaClient = require("../../../client/EnkaClient");
const UpgradableSkill = require("./UpgradableSkill");

/** 
 * @en UniqueSkill
 * @extends {UpgradableSkill}
 * @description Elemental Skill and Elemental Burst
 */
class UniqueSkill extends UpgradableSkill {

    /** 
     * @param {number} id
     * @param {EnkaClient} enka
     */
    constructor(id, enka) {
        super(id, enka);

        /** @type {number} */
        this.maxCharge = this._data.maxChargeNum ?? 0;

        /** @type {number} */
        this.cooldown = this._data.cdTime;

    }
}

module.exports = UniqueSkill;