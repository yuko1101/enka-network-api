import EnkaClient from "../../../client/EnkaClient";
import UpgradableSkill from "./UpgradableSkill";

/**
 * @en NormalAttack
 * @extends {UpgradableSkill}
 */
export default class NormalAttack extends UpgradableSkill {
    constructor(id: number, enka: EnkaClient) {
        super(id, enka);
    }
}