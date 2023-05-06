import { JsonManager } from "config_file.js";
import EnkaClient from "../../../client/EnkaClient";
import SkillAttributeAssets from "../../assets/SkillAttributeAssets";
import TextAssets from "../../assets/TextAssets";
import UpgradeCost from "../../material/UpgradeCost";
import Skill from "./Skill";

/**
 * @en CombatSkill
 * @extends {Skill}
 */
class UpgradableSkill extends Skill {
    /**
     * @param id
     * @param enka
     */
    constructor(id: number, enka: EnkaClient) {
        super(id, enka);
    }

    /**
     * @param level
     */
    getSkillAttributes(level: number): SkillAttributeAssets[] {
        const proudSkillGroupId = new JsonManager(this._data, true, true).getAsNumber("proudSkillGroupId");
        if (!proudSkillGroupId) return [];

        const leveledSkillData = this.enka.cachedAssetsManager.getGenshinCacheData("ProudSkillExcelConfigData").find(p => p.getAsNumber("proudSkillGroupId") === proudSkillGroupId && p.getAsNumber("level") === level)?.detach();
        if (!leveledSkillData) return [];

        const paramDescList = leveledSkillData.has("paramDescList") ? leveledSkillData.get("paramDescList").detach().map(p => p.getAsNumber()) : undefined;

        if (!paramDescList) return [];

        return paramDescList.map(id => {
            // TODO: better filter
            try {
                new TextAssets(id, this.enka).get("en");
            } catch (e) {
                return null;
            }

            return new SkillAttributeAssets(id, this.enka, leveledSkillData.has("paramList") ? leveledSkillData.get("paramList").detach().map(p => p.getAsNumber()) : []);
        }).filter(attr => attr !== null).map(attr => attr as NonNullable<typeof attr>);
    }

    /**
     * @param level the base level you want to upgrade to. (Do not add extra levels.)
     */
    getUpgradeCost(level: number): UpgradeCost | null {
        const proudSkillGroupId = new JsonManager(this._data, true, true).getAsNumber("proudSkillGroupId");
        if (!proudSkillGroupId) return null;

        const leveledSkillData = this.enka.cachedAssetsManager.getGenshinCacheData("ProudSkillExcelConfigData").find(p => p.getAsNumber("proudSkillGroupId") === proudSkillGroupId && p.getAsNumber("level") === level)?.detach();
        if (!leveledSkillData) return null;

        return new UpgradeCost(leveledSkillData.has("coinCost") ? leveledSkillData.getAsNumber("coinCost") : 0, leveledSkillData.has("costItems") ? leveledSkillData.get("costItems").detach().map(p => p.getAsJsonObject()) : [], this.enka);
    }
}

export default UpgradableSkill;