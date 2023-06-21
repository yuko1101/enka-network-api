import { JsonObject } from "config_file.js";
import EnkaClient from "../../../client/EnkaClient";
import UniqueSkill from "./UniqueSkill";

/**
 * @en ElementalSkill
 * @extends {UniqueSkill}
 */
class ElementalSkill extends UniqueSkill {
    /**
     * @param data
     * @param enka
     */
    constructor(data: JsonObject, enka: EnkaClient) {
        super(data, enka);
    }

    /**
     * @param id
     * @param enka
     */
    static getById(id: number, enka: EnkaClient): ElementalSkill {
        return new ElementalSkill(this._getJsonObjectById(id, enka), enka);
    }
}

export default ElementalSkill;