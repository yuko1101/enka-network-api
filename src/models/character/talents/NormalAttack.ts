import { EnkaClient } from "../../../client/EnkaClient";
import { UpgradableSkill } from "./UpgradableSkill";

export class NormalAttack extends UpgradableSkill {
    static getById(id: number, enka: EnkaClient): NormalAttack {
        return new NormalAttack(this._getJsonObjectById(id, enka), enka);
    }
}
