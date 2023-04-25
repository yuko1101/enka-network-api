import Element from "../../Element";
import UniqueSkill from "./UniqueSkill";

/**
 * @en ElementalBurst
 * @extends {UniqueSkill}
 */
export default class ElementalBurst extends UniqueSkill {

    /**
     * @param {number} id
     * @param {import("../../../client/EnkaClient")} enka
     */
    constructor(id, enka) {
        super(id, enka);

        /** @type {Element} */
        this.costElemType = new Element(this._data.costElemType, enka);

        /** @type {number} */
        this.costElemVal = this._data.costElemVal;

    }
}