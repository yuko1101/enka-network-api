const Artifact = require("../artifact/Artifact");
const CharacterData = require("./CharacterData");
const Weapon = require("../weapon/Weapon");
const CharacterStatus = require("./CharacterStatus");
const SkillLevel = require("./talents/SkillLevel");
const UpgradableSkill = require("./talents/UpgradableSkill");
const NormalAttack = require("./talents/NormalAttack");
const ElementalSkill = require("./talents/ElementalSkill");
const ElementalBurst = require("./talents/ElementalBurst");

/**
 * @en Character
 */
class Character {

    /**
     * @param {Object<string, any>} data
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(data, enka) {

        /** @type {import("../../client/EnkaClient")} */
        this.enka = enka;

        /** @type {Object<string, any>} */
        this._data = data;

        /** @type {CharacterData} */
        this.characterData = new CharacterData(data.avatarId, enka, data.skillDepotId);

        /** @type {import("./Costume")} */
        this.costume = data.costumeId ? this.characterData.costumes.find(c => c.id === data.costumeId) : this.characterData.costumes.find(c => c.isDefault);

        /** @type {Array<Artifact>} */
        this.artifacts = data.equipList.filter(item => Object.keys(item).includes("reliquary")).map(artifact => new Artifact(artifact, enka));

        /** @type {Weapon} */
        this.weapon = new Weapon(data.equipList.find(item => Object.keys(item).includes("weapon")), enka);

        /** @type {CharacterStatus} */
        this.status = new CharacterStatus(data.fightPropMap, enka, this.characterData.element);

        /** @type {number} */
        this.level = Number(data.propMap[4001]?.ival ?? 0);

        /** @type {number} */
        this.xp = Number(data.propMap[1001]?.ival ?? 0);

        /** @type {number} */
        this.ascension = Number(data.propMap[1002]?.ival ?? 0);

        /** @type {number} */
        this.maxLevel = (this.ascension + 1) * 20 - (this.ascension > 1 ? (this.ascension - 1) * 10 : 0);

        /** @type {number} */
        this.stamina = Number(data.propMap[10010]?.ival ?? 10000) / 100;

        /**
         * Traveler's friendship is always 1.
         *  @type {number}
         */
        this.friendship = data.fetterInfo?.expLevel ?? 1;

        /** @type {Array<import("./Constellation")>} */
        this.unlockedConstellations = this.characterData.constellations.filter(c => (data.talentIdList ?? []).includes(c.id));

        /** @type {Array<{skill: import("./talents/Skill"), level: SkillLevel}>} */
        this.skillLevels = Object.entries(data.skillLevelMap).map(([key, value]) => {
            const skill = this.characterData.skills.find(s => s.id.toString() === key);
            if (!skill || !(skill instanceof UpgradableSkill)) return null;

            const base = value;
            const extra = data.proudSkillExtraLevelMap?.[skill._data.proudSkillGroupId] ?? 0;

            return {
                skill,
                level: new SkillLevel(base, extra),
            };
        }).filter(s => s !== null).sort((a, b) => {
            const getScore = (skill) => (skill instanceof NormalAttack) ? 0 : (skill instanceof ElementalSkill) ? 1 : (skill instanceof ElementalBurst) ? 2 : 3;
            return getScore(a.skill) - getScore(b.skill);
        });

        /** @type {Array<import("./talents/PassiveTalent")>} */
        this.unlockedPassiveTalents = this.characterData.passiveTalents.filter(p => (data.inherentProudSkillList ?? []).includes(p.id));

    }
}

module.exports = Character;