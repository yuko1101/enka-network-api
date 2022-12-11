const TextAssets = require("../../assets/TextAssets");
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
     * @returns {Array<{name: TextAssets, value: number}> | null}
     */
    getSkillAttributes(level) {
        const proudSkillGroupId = this._data.proudSkillGroupId;
        if (!proudSkillGroupId) return null;

        const leveledSkillData = require(this.enka.cachedAssetsManager.getJSONDataPath("ProudSkillExcelConfigData")).find(s => s.proudSkillGroupId === proudSkillGroupId && s.level === level);
        if (!leveledSkillData) return null;

        if (!leveledSkillData.paramDescList || !leveledSkillData.paramList) return null;

        return leveledSkillData.paramDescList.map((id, index) => {
            return {
                name: new TextAssets(id, this.enka),
                value: leveledSkillData.paramList[index]
            }
        });
    }
}

module.exports = UpgradableSkill;