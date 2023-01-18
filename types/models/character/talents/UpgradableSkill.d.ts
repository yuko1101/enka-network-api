export = UpgradableSkill;
/**
 * @en CombatSkill
 * @extends {Skill}
 */
declare class UpgradableSkill extends Skill {
    /**
     * @param {number} level
     * @returns {Array<SkillAttributeAssets>}
     */
    getSkillAttributes(level: number): Array<SkillAttributeAssets>;
}
import Skill = require("./Skill");
import SkillAttributeAssets = require("../../assets/SkillAttributeAssets");
