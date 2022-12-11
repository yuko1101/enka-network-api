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
}
import Skill = require("./Skill");
