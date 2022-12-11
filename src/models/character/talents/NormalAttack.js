const EnkaClient = require("../../../client/EnkaClient");
const UpgradableSkill = require("./UpgradableSkill");

/** 
 * @en NormalAttack
 * @extends {UpgradableSkill}
 */
class NormalAttack extends UpgradableSkill {

    /** 
     * @param {number} id
     * @param {EnkaClient} enka
     */
    constructor(id, enka) {
        super(id, enka);
    }
}

module.exports = NormalAttack;