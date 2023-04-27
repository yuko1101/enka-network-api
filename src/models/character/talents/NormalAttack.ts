import EnkaClient from "../../../client/EnkaClient";
import UpgradableSkill from "./UpgradableSkill";

/**
 * @en NormalAttack
 * @extends {UpgradableSkill}
 */
class NormalAttack extends UpgradableSkill {
    constructor(id: number, enka: EnkaClient) {
        super(id, enka);
    }
}

export default NormalAttack;