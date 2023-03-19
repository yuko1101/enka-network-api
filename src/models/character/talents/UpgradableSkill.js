const SkillAttributeAssets = require("../../assets/SkillAttributeAssets");
const TextAssets = require("../../assets/TextAssets");
const UpgradeCost = require("../../material/UpgradeCost");
const Skill = require("./Skill");

/**
 * @en CombatSkill
 * @extends {Skill}
 */
class UpgradableSkill extends Skill {
    /**
     * @param {number} id
     * @param {import("../../../client/EnkaClient")} enka
     */
    constructor(id, enka) {
        super(id, enka);
    }

    /**
     * @param {number} level
     * @returns {Array<SkillAttributeAssets>}
     */
    getSkillAttributes(level) {
        const proudSkillGroupId = this._data.proudSkillGroupId;
        if (!proudSkillGroupId) return [];

        const leveledSkillData = this.enka.cachedAssetsManager.getGenshinCacheData("ProudSkillExcelConfigData").find(s => s.proudSkillGroupId === proudSkillGroupId && s.level === level);
        if (!leveledSkillData) return [];

        if (!leveledSkillData.paramDescList) return [];

        return leveledSkillData.paramDescList.map(id => {
            // TODO: better filter
            try {
                new TextAssets(id, this.enka).get("en");
            } catch (e) {
                return null;
            }

            return new SkillAttributeAssets(id, this.enka, leveledSkillData.paramList);
        }).filter(attr => attr !== null);
    }

    /**
     * @param {number} level the base level you want to upgrade to. (Do not add extra levels.)
     * @returns {UpgradeCost | null}
     */
    getUpgradeCost(level) {
        const proudSkillGroupId = this._data.proudSkillGroupId;
        if (!proudSkillGroupId) return null;

        const leveledSkillData = this.enka.cachedAssetsManager.getGenshinCacheData("ProudSkillExcelConfigData").find(s => s.proudSkillGroupId === proudSkillGroupId && s.level === level);
        if (!leveledSkillData) return null;

        return new UpgradeCost(leveledSkillData.coinCost ?? 0, leveledSkillData.costItems ?? [], this.enka);
    }
}

module.exports = UpgradableSkill;