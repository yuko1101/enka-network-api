import EnkaClient from "../../../client/EnkaClient";
import UniqueSkill from "./UniqueSkill";

/**
 * @en ElementalSkill
 * @extends {UniqueSkill}
 */
export default class ElementalSkill extends UniqueSkill {
    constructor(id: number, enka: EnkaClient) {
        super(id, enka);
    }
}