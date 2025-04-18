import { JsonReader } from "config_file.js";
import { EnkaClient } from "../../../client/EnkaClient";
import { UpgradableSkill } from "./UpgradableSkill";
import { ExcelJsonObject, excelJsonOptions } from "../../../client/ExcelTransformer";

/**
 * Elemental Skill and Elemental Burst
 */
export class UniqueSkill extends UpgradableSkill {
    readonly maxCharge: number;
    readonly cooldown: number;

    constructor(data: ExcelJsonObject, enka: EnkaClient) {
        super(data, enka);

        const json = new JsonReader(excelJsonOptions, this._data);

        this.maxCharge = json.getAsNumberWithDefault(1, "maxChargeNum");

        this.cooldown = json.getAsNumber("cdTime");

    }

    static getById(id: number, enka: EnkaClient): UniqueSkill {
        return new UniqueSkill(this._getJsonObjectById(id, enka), enka);
    }
}
