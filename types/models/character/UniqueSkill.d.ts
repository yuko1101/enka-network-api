export = UniqueSkill;
/**
 * @en UniqueSkill
 * @extends {Skill}
 * @description Elemental Skill and Elemental Burst
 */
declare class UniqueSkill extends Skill {
    /** @type {number} */
    maxCharge: number;
    /** @type {number} */
    cooldown: number;
}
import Skill = require("./Skill");
