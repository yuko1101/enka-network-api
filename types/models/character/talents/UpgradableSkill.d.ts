export = UpgradableSkill;
/**
 * @en CombatSkill
 * @extends {Skill}
 */
declare class UpgradableSkill extends Skill {
    /**
     * @param {number} id
     * @param {EnkaClient} enka
     */
    constructor(id: number, enka: EnkaClient);
    /**
     * @param {number} level
     * @returns {Array<SkillAttributeAssets>}
     */
    getSkillAttributes(level: number): Array<SkillAttributeAssets>;
}
import Skill = require("./Skill");
import SkillAttributeAssets = require("../../assets/SkillAttributeAssets");
