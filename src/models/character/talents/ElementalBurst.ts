import { JsonObject, JsonReader } from "config_file.js";
import { EnkaClient } from "../../../client/EnkaClient";
import { Element, ElementType } from "../../Element";
import { UniqueSkill } from "./UniqueSkill";

export class ElementalBurst extends UniqueSkill {
    readonly costElemType: Element;
    /** @deprecated use requiredCharge or maxCharge instead */
    readonly costElemVal: number;
    readonly requiredCharge: number;
    readonly maxCharge: number;

    constructor(data: JsonObject, enka: EnkaClient) {
        super(data, enka);

        const json = new JsonReader(this._data);

        this.costElemType = Element.getByElementType(json.getAsString("costElemType") as ElementType, enka);

        this.costElemVal = json.getAsNumberWithDefault(200, "costElemVal"); // temporary fallback value for Mavuika's elemental burst

        if (json.has("costElemVal")) {
            const cost = json.getAsNumber("costElemVal");
            this.requiredCharge = cost;
            this.maxCharge = cost;
        } else {
            this.requiredCharge = json.getAsNumber(enka.cachedAssetsManager.getObjectKeysManager().elementalBurstRequiredKey);
            this.maxCharge = json.getAsNumber(enka.cachedAssetsManager.getObjectKeysManager().elementalBurstMaxChargeKey);
        }
    }

    static getById(id: number, enka: EnkaClient): ElementalBurst {
        return new ElementalBurst(this._getJsonObjectById(id, enka), enka);
    }
}
