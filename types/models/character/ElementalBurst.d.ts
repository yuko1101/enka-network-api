export = ElementalBurst;
/** @extends {Skill} */
/**
 * @en ElementalBurst
 */
declare class ElementalBurst extends Skill {
    /** @type {Element} */
    costElemType: Element;
    /** @type {number} */
    costElemVal: number;
}
import Skill = require("./Skill");
import Element = require("../Element");
