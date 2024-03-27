import { JsonObject } from "config_file.js";
import EnkaClient from "../../../client/EnkaClient";
import UpgradableSkill from "./UpgradableSkill";

class NormalAttack extends UpgradableSkill {
    constructor(data: JsonObject, enka: EnkaClient) {
        super(data, enka);
    }

    static getById(id: number, enka: EnkaClient): NormalAttack {
        return new NormalAttack(this._getJsonObjectById(id, enka), enka);
    }
}

export default NormalAttack;