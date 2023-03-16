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
    /**
     * @param {number} level the base level you want to upgrade to. (Do not add extra levels.)
     * @returns {UpgradeCost | null}
     */
    getUpgradeCost(level: number): UpgradeCost | null;
}
import Skill = require("./Skill");
import SkillAttributeAssets = require("../../assets/SkillAttributeAssets");
import UpgradeCost = require("../../material/UpgradeCost");
