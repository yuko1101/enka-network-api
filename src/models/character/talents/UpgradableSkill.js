const Skill = require("./Skill");

/**
 * @en CombatSkill
 * @extends {Skill}
 */
class UpgradableSkill extends Skill {
    /** 
     * @param {number} id
     * @param {EnkaClient} enka
     */
    constructor(id, enka) {
        super(id, enka);
    }
}

module.exports = UpgradableSkill;