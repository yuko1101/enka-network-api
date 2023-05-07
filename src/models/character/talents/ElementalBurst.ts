import { JsonReader } from "config_file.js";
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

        const json = new JsonReader(this._data);

        this.costElemType = new Element(json.getAsString("costElemType") as ElementType, enka);

        this.costElemVal = json.getAsNumber("costElemVal");

    }
}

export default ElementalBurst;