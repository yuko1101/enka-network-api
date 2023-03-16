// eslint-disable-next-line no-unused-vars
const EnkaClient = require("../../../client/EnkaClient");
const SkillAttributeAssets = require("../../assets/SkillAttributeAssets");
const TextAssets = require("../../assets/TextAssets");
const Material = require("../../material/Material");
const Skill = require("./Skill");

/**
 * @en CombatSkill
 * @extends {Skill}
 */
class UpgradableSkill extends Skill {
    /**
     * @param {number} id
     * @param {EnkaClient} enka
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
     * @param {number} level the level you want to upgrade to.
     * @returns {Array<{material: Material, count: number}>}
     */
    getUpgradeCost(level) {
        const proudSkillGroupId = this._data.proudSkillGroupId;
        if (!proudSkillGroupId) return [];

        const leveledSkillData = this.enka.cachedAssetsManager.getGenshinCacheData("ProudSkillExcelConfigData").find(s => s.proudSkillGroupId === proudSkillGroupId && s.level === level);
        if (!leveledSkillData) return [];

        if (!leveledSkillData.costItems) return [];

        return leveledSkillData.costItems.map(c => {
            return {
                material: Material.getMaterialById(c.id),
                count: c.count,
            };
        });
    }
}

module.exports = UpgradableSkill;