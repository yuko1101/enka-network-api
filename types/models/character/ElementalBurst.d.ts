export = ElementalBurst;
/**
 * @en ElementalBurst
 * @extends {UniqueSkill}
 */
declare class ElementalBurst extends UniqueSkill {
    /** @type {Element} */
    costElemType: Element;
    /** @type {number} */
    costElemVal: number;
}
import UniqueSkill = require("./UniqueSkill");
import Element = require("../Element");
