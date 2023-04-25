import UniqueSkill from "./UniqueSkill";

/**
 * @en ElementalSkill
 * @extends {UniqueSkill}
 */
export default class ElementalSkill extends UniqueSkill {

    /**
     * @param {number} id
     * @param {import("../../../client/EnkaClient")} enka
     */
    constructor(id, enka) {
        super(id, enka);
    }
}