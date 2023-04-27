import EnkaClient from "../../../client/EnkaClient";
import UniqueSkill from "./UniqueSkill";

/**
 * @en ElementalSkill
 * @extends {UniqueSkill}
 */
class ElementalSkill extends UniqueSkill {
    constructor(id: number, enka: EnkaClient) {
        super(id, enka);
    }
}

export default ElementalSkill;