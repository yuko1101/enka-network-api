const EnkaClient = require("../../client/EnkaClient");
const Artifact = require("../artifact/Artifact");
const CharacterData = require("./CharacterData");
const Weapon = require("../weapon/Weapon");
const CharacterStatus = require("./CharacterStatus");
const Constellation = require("./Constellation");
const Skill = require("./Skill");
const PassiveTalent = require("./PassiveTalent");
const Costume = require("./Costume");

/** 
 * @exports
 * @module enka-network-api
 */
class Character {

    /** 
     * @param {object} data
     * @param {EnkaClient} enka
     */
    constructor(data, enka) {

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {object} */
        this._data = data;

        /** @type {CharacterData} */
        this.characterData = new CharacterData(data.avatarId, enka, data.skillDepotId);

        /** @type {Costume} */
        this.costume = data.costumeId ? this.characterData.costumes.find(c => c.id === data.costumeId) : this.characterData.costumes.find(c => c.isDefault);

        /** @type {Artifact[]} */
        this.artifacts = data.equipList.filter(item => item.hasOwnProperty("reliquary")).map(artifact => new Artifact(artifact, enka));

        /** @type {Weapon} */
        this.weapon = new Weapon(data.equipList.find(item => item.hasOwnProperty("weapon")), enka);

        /** @type {CharacterStatus} */
        this.status = new CharacterStatus(data.fightPropMap, enka);

        /** @type {number} */
        this.level = Number(data.propMap[4001]?.ival ?? 0);

        /** @type {number} */
        this.xp = Number(data.propMap[1001]?.ival ?? 0);

        /** @type {number} */
        this.ascension = Number(data.propMap[1002]?.ival ?? 0);

        /** @type {number} */
        this.maxLevel = (this.ascension + 1) * 20 - (this.ascension > 1 ? (this.ascension - 1) * 10 : 0);

        /** 
         * Traveler's friendship is always 1.
         *  @type {number} 
         */
        this.friendship = data.fetterInfo?.expLevel ?? 1;

        /** @type {Constellation[]} */
        this.unlockedConstellations = this.characterData.constellations.filter(c => (data.talentIdList ?? []).includes(c.id));

        /** @type {{skill: Skill, level: number}[]} */
        this.skillLevels = Object.entries(data.skillLevelMap).map(([key, value]) => {
            return {
                skill: this.characterData.skills.find(s => s.id === key),
                level: value
            };
        });

        /** @type {PassiveTalent[]} */
        this.unlockedPassiveTalents = this.characterData.passiveTalents.filter(p => (data.inherentProudSkillList ?? []).includes(p.id));

    }
}

module.exports = Character;