const EnkaClient = require("../../client/EnkaClient");
const Element = require("../Element");
const UniqueSkill = require("./UniqueSkill");

/** 
 * @en ElementalBurst
 * @extends {UniqueSkill}
 */
class ElementalBurst extends UniqueSkill {

    /** 
     * @param {number} id
     * @param {EnkaClient} enka
     */
    constructor(id, enka) {
        super(id, enka);

        /** @type {Element} */
        this.costElemType = new Element(this._data.costElemType, enka);

        /** @type {number} */
        this.costElemVal = this._data.costElemVal;

    }
}

module.exports = ElementalBurst;