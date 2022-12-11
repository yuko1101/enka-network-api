export = UniqueSkill;
/**
 * @en UniqueSkill
 * @extends {UpgradableSkill}
 * @description Elemental Skill and Elemental Burst
 */
declare class UniqueSkill extends UpgradableSkill {
    /**
     * @param {number} id
     * @param {EnkaClient} enka
     */
    constructor(id: number, enka: EnkaClient);
    /** @type {number} */
    maxCharge: number;
    /** @type {number} */
    cooldown: number;
}
import UpgradableSkill = require("./UpgradableSkill");
import EnkaClient = require("../../../client/EnkaClient");
