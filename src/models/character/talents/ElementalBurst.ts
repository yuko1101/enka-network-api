import EnkaClient from "../../../client/EnkaClient";
import Element from "../../Element";
import UniqueSkill from "./UniqueSkill";

/**
 * @en ElementalBurst
 * @extends {UniqueSkill}
 */
export default class ElementalBurst extends UniqueSkill {
    public costElemType: Element;
    public costElemVal: number;

    constructor(id: number, enka: EnkaClient) {
        super(id, enka);

        /** @type {Element} */
        this.costElemType = new Element(this._data.costElemType, enka);

        /** @type {number} */
        this.costElemVal = this._data.costElemVal as number;

    }
}