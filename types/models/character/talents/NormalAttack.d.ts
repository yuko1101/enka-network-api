export = NormalAttack;
/**
 * @en NormalAttack
 * @extends {UpgradableSkill}
 */
declare class NormalAttack extends UpgradableSkill {
    /**
     * @param {number} id
     * @param {EnkaClient} enka
     */
    constructor(id: number, enka: EnkaClient);
}
import UpgradableSkill = require("./UpgradableSkill");
import EnkaClient = require("../../../client/EnkaClient");
