const UniqueSkill = require("./UniqueSkill");

/**
 * @en ElementalSkill
 * @extends {UniqueSkill}
 */
class ElementalSkill extends UniqueSkill {

    /**
     * @param {number} id
     * @param {import("../../../client/EnkaClient")} enka
     */
    constructor(id, enka) {
        super(id, enka);
    }
}

module.exports = ElementalSkill;