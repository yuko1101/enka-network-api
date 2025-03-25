import { JsonReader } from "config_file.js";
import { EnkaClient } from "../../../client/EnkaClient";
import { SkillAttributeAssets } from "../../assets/SkillAttributeAssets";
import { TextAssets } from "../../assets/TextAssets";
import { UpgradeCost } from "../../material/UpgradeCost";
import { Skill } from "./Skill";
import { nonNullable } from "../../../utils/ts_utils";
import { excelJsonOptions } from "../../../client/ExcelTransformer";

export class UpgradableSkill extends Skill {
    getSkillAttributes(level: number): SkillAttributeAssets[] {
        const proudSkillGroupId = new JsonReader(excelJsonOptions, this._data).getAsNumber("proudSkillGroupId");
        if (!proudSkillGroupId) return [];

        const leveledSkillData = this.enka.cachedAssetsManager.getExcelData("ProudSkillExcelConfigData", proudSkillGroupId, level);
        if (!leveledSkillData) return [];
        const json = new JsonReader(excelJsonOptions, leveledSkillData);

        const paramDescList = json.has("paramDescList") ? json.get("paramDescList").mapArray((_, p) => p.getAsNumber()) : undefined;

        if (!paramDescList) return [];

        return paramDescList.map(id => {
            // TODO: better filter
            try {
                new TextAssets(id, this.enka).get("en");
            } catch {
                return null;
            }

            return new SkillAttributeAssets(id, json.has("paramList") ? json.get("paramList").mapArray((_, p) => p.getAsNumber()) : [], this.enka);
        }).filter(nonNullable);
    }

    /**
     * @param level the base level you want to upgrade to. (Do not add extra levels.)
     */
    getUpgradeCost(level: number): UpgradeCost | null {
        const proudSkillGroupId = new JsonReader(excelJsonOptions, this._data).getAsNumber("proudSkillGroupId");
        if (!proudSkillGroupId) return null;

        const leveledSkillData = this.enka.cachedAssetsManager.getExcelData("ProudSkillExcelConfigData", proudSkillGroupId, level);
        if (!leveledSkillData) return null;
        const json = new JsonReader(excelJsonOptions, leveledSkillData);

        return new UpgradeCost(json.getAsNumberWithDefault(0, "coinCost"), json.has("costItems") ? json.get("costItems").mapArray((_, p) => p.getAsJsonObject()) : [], this.enka);
    }

    static getById(id: number, enka: EnkaClient): UpgradableSkill {
        return new UpgradableSkill(this._getJsonObjectById(id, enka), enka);
    }
}
