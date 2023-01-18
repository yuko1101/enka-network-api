export = UniqueSkill;
/**
 * @en UniqueSkill
 * @extends {UpgradableSkill}
 * @description Elemental Skill and Elemental Burst
 */
declare class UniqueSkill extends UpgradableSkill {
    /** @type {number} */
    maxCharge: number;
    /** @type {number} */
    cooldown: number;
}
import UpgradableSkill = require("./UpgradableSkill");
