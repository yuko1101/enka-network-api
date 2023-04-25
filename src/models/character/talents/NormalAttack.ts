import UpgradableSkill from "./UpgradableSkill";

/**
 * @en NormalAttack
 * @extends {UpgradableSkill}
 */
export default class NormalAttack extends UpgradableSkill {

    /**
     * @param {number} id
     * @param {import("../../../client/EnkaClient")} enka
     */
    constructor(id, enka) {
        super(id, enka);
    }
}