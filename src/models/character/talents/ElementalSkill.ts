import { JsonObject } from "config_file.js";
import EnkaClient from "../../../client/EnkaClient";
import UniqueSkill from "./UniqueSkill";

class ElementalSkill extends UniqueSkill {
    constructor(data: JsonObject, enka: EnkaClient) {
        super(data, enka);
    }

    static getById(id: number, enka: EnkaClient): ElementalSkill {
        return new ElementalSkill(this._getJsonObjectById(id, enka), enka);
    }
}

export default ElementalSkill;