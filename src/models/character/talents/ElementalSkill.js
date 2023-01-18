// eslint-disable-next-line no-unused-vars
const EnkaClient = require("../../../client/EnkaClient");
const UniqueSkill = require("./UniqueSkill");

/**
 * @en ElementalSkill
 * @extends {UniqueSkill}
 */
class ElementalSkill extends UniqueSkill {

    /**
     * @param {number} id
     * @param {EnkaClient} enka
     */
    constructor(id, enka) {
        super(id, enka);
    }
}

module.exports = ElementalSkill;