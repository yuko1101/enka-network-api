const EnkaClient = require("../../client/EnkaClient");
const Skill = require("./Skill");

/** 
 * @en NormalAttack
 * @extends {Skill}
 */
class NormalAttack extends Skill {

    /** 
     * @param {number} id
     * @param {EnkaClient} enka
     */
    constructor(id, enka) {
        super(id, enka);
    }
}

module.exports = NormalAttack;