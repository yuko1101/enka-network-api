const EnkaClient = require("../../client/EnkaClient");
const Skill = require("./Skill");

/** 
 * @en UniqueSkill
 * @extends {Skill}
 * @description Elemental Skill and Elemental Burst
 */
class UniqueSkill extends Skill {

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