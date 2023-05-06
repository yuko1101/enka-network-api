import { JsonObject } from "config_file.js";
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
        const proudSkillGroupId = this._data.proudSkillGroupId;
        if (!proudSkillGroupId) return [];

        const leveledSkillData = this.enka.cachedAssetsManager.getGenshinCacheData("ProudSkillExcelConfigData").find(s => s.proudSkillGroupId === proudSkillGroupId && s.level === level);
        if (!leveledSkillData) return [];

        if (!leveledSkillData.paramDescList) return [];

        return (leveledSkillData.paramDescList as number[]).map(id => {
            // TODO: better filter
            try {
                new TextAssets(id, this.enka).get("en");
            } catch (e) {
                return null;
            }

            return new SkillAttributeAssets(id, this.enka, leveledSkillData.paramList as number[]);
        }).filter(attr => attr !== null).map(attr => attr as NonNullable<typeof attr>);
    }

    /**
     * @param level the base level you want to upgrade to. (Do not add extra levels.)
     */
    getUpgradeCost(level: number): UpgradeCost | null {
        const proudSkillGroupId = this._data.proudSkillGroupId;
        if (!proudSkillGroupId) return null;

        const leveledSkillData = this.enka.cachedAssetsManager.getGenshinCacheData("ProudSkillExcelConfigData").find(s => s.proudSkillGroupId === proudSkillGroupId && s.level === level);
        if (!leveledSkillData) return null;

        return new UpgradeCost((leveledSkillData.coinCost ?? 0) as number, (leveledSkillData.costItems ?? []) as JsonObject[], this.enka);
    }
}

export default UpgradableSkill;