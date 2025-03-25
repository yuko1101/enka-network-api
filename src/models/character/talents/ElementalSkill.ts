import { EnkaClient } from "../../../client/EnkaClient";
import { UniqueSkill } from "./UniqueSkill";

export class ElementalSkill extends UniqueSkill {
    static getById(id: number, enka: EnkaClient): ElementalSkill {
        return new ElementalSkill(this._getJsonObjectById(id, enka), enka);
    }
}
