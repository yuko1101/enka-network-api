const UpgradableSkill = require("./UpgradableSkill");

/**
 * @en NormalAttack
 * @extends {UpgradableSkill}
 */
class NormalAttack extends UpgradableSkill {

    /**
     * @param {number} id
     * @param {import("../../../client/EnkaClient")} enka
     */
    constructor(id, enka) {
        super(id, enka);
    }
}

module.exports = NormalAttack;