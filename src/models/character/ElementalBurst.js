const EnkaClient = require("../../client/EnkaClient");
const Element = require("../Element");
const Skill = require("./Skill");

/** @extends {Skill} */
/** 
 * @exports ElementalBurst
 * @module enka-network-api
 */
class ElementalBurst extends Skill {

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