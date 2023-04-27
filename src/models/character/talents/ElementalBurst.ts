import EnkaClient from "../../../client/EnkaClient";
import Element, { ElementType } from "../../Element";
import UniqueSkill from "./UniqueSkill";

/**
 * @en ElementalBurst
 * @extends {UniqueSkill}
 */
export default class ElementalBurst extends UniqueSkill {
    readonly costElemType: Element;
    readonly costElemVal: number;

    constructor(id: number, enka: EnkaClient) {
        super(id, enka);

        this.costElemType = new Element(this._data.costElemType as ElementType, enka);

        this.costElemVal = this._data.costElemVal as number;

    }
}