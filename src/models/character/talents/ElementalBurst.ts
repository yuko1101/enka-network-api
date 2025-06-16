import { JsonReader } from "config_file.js";
import { EnkaClient } from "../../../client/EnkaClient";
import { Element, ElementType } from "../../Element";
import { UniqueSkill } from "./UniqueSkill";
import { ExcelJsonObject, excelJsonOptions } from "../../../client/ExcelTransformer";

export class ElementalBurst extends UniqueSkill {
    readonly costElemType: Element;
    /** @deprecated use requiredCharge or maxCharge instead */
    readonly costElemVal: number;
    readonly requiredCharge: number;
    readonly maxCharge: number;

    constructor(data: ExcelJsonObject, enka: EnkaClient) {
        super(data, enka);

        const json = new JsonReader(excelJsonOptions, this._data);

        this.costElemType = Element.getByElementType(json.getAsString("costElemType") as ElementType, enka);

        this.costElemVal = json.getAsNumber("costElemVal");

        if (this.costElemVal > 0) {
            const cost = this.costElemVal;
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
