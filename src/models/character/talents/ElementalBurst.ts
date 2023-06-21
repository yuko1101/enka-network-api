import { JsonObject, JsonReader } from "config_file.js";
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
     * @param data
     * @param enka
     */
    constructor(data: JsonObject, enka: EnkaClient) {
        super(data, enka);

        const json = new JsonReader(this._data);

        this.costElemType = Element.getByElementType(json.getAsString("costElemType") as ElementType, enka);

        this.costElemVal = json.getAsNumber("costElemVal");
    }

    /**
     * @param id
     * @param enka
     */
    static getById(id: number, enka: EnkaClient): ElementalBurst {
        return new ElementalBurst(this._getJsonObjectById(id, enka), enka);
    }
}

export default ElementalBurst;