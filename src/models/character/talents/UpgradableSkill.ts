import { JsonObject, JsonReader } from "config_file.js";
import EnkaClient from "../../../client/EnkaClient";
import SkillAttributeAssets from "../../assets/SkillAttributeAssets";
import TextAssets from "../../assets/TextAssets";
import UpgradeCost from "../../material/UpgradeCost";
import Skill from "./Skill";
import { nonNullable } from "../../../utils/ts_utils";

class UpgradableSkill extends Skill {
    constructor(data: JsonObject, enka: EnkaClient) {
        super(data, enka);
    }

    getSkillAttributes(level: number): SkillAttributeAssets[] {
        const proudSkillGroupId = new JsonReader(this._data).getAsNumber("proudSkillGroupId");
        if (!proudSkillGroupId) return [];

        const leveledSkillData = this.enka.cachedAssetsManager.getGenshinCacheData("ProudSkillExcelConfigData").findArray((_, p) => p.getAsNumber("proudSkillGroupId") === proudSkillGroupId && p.getAsNumber("level") === level)?.[1];
        if (!leveledSkillData) return [];

        const paramDescList = leveledSkillData.has("paramDescList") ? leveledSkillData.get("paramDescList").mapArray((_, p) => p.getAsNumber()) : undefined;

        if (!paramDescList) return [];

        return paramDescList.map(id => {
            // TODO: better filter
            try {
                new TextAssets(id, this.enka).get("en");
            } catch (e) {
                return null;
            }

            return new SkillAttributeAssets(id, leveledSkillData.has("paramList") ? leveledSkillData.get("paramList").mapArray((_, p) => p.getAsNumber()) : [], this.enka);
        }).filter(nonNullable);
    }

    /**
     * @param level the base level you want to upgrade to. (Do not add extra levels.)
     */
    getUpgradeCost(level: number): UpgradeCost | null {
        const proudSkillGroupId = new JsonReader(this._data).getAsNumber("proudSkillGroupId");
        if (!proudSkillGroupId) return null;

        const leveledSkillData = this.enka.cachedAssetsManager.getGenshinCacheData("ProudSkillExcelConfigData").findArray((_, p) => p.getAsNumber("proudSkillGroupId") === proudSkillGroupId && p.getAsNumber("level") === level)?.[1];
        if (!leveledSkillData) return null;

        return new UpgradeCost(leveledSkillData.getAsNumberWithDefault(0, "coinCost"), leveledSkillData.has("costItems") ? leveledSkillData.get("costItems").mapArray((_, p) => p.getAsJsonObject()) : [], this.enka);
    }

    static getById(id: number, enka: EnkaClient): UpgradableSkill {
        return new UpgradableSkill(this._getJsonObjectById(id, enka), enka);
    }
}

export default UpgradableSkill;