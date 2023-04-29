import EnkaClient from "../../../client/EnkaClient";
import Element, { ElementType } from "../../Element";
import UniqueSkill from "./UniqueSkill";

/**
 * @en ElementalBurst
 * @extends {UniqueSkill}
 */
class ElementalBurst extends UniqueSkill {
    /**  */
    readonly costElemType: Element;
    /**  */
    readonly costElemVal: number;

    /**
     * @param id
     * @param enka
     */
    constructor(id: number, enka: EnkaClient) {
        super(id, enka);

        this.costElemType = new Element(this._data.costElemType as ElementType, enka);

        this.costElemVal = this._data.costElemVal as number;

    }
}

export default ElementalBurst;