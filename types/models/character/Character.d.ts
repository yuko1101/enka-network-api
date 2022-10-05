export = Character;
declare class Character {
    /**
     * @param {object} data
     * @param {EnkaClient} enka
     */
    constructor(data: object, enka: EnkaClient);
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {object} */
    _data: object;
    /** @type {CharacterData} */
    avatar: CharacterData;
    /** @type {Artifact[]} */
    artifacts: Artifact[];
    /** @type {Weapon} */
    weapon: Weapon;
    /** @type {CharacterStatus} */
    status: CharacterStatus;
    /** @type {number} */
    level: number;
    /** @type {number} */
    xp: number;
    /** @type {number} */
    ascension: number;
    /** @type {number} */
    maxLevel: number;
    /** @type {Constellation[]} */
    unlockedConstellations: Constellation[];
    /** @type {{skill: Skill, level: number}[]} */
    skillLevels: {
        skill: Skill;
        level: number;
    }[];
    /** @type {PassiveTalent[]} */
    unlockedPassiveTalents: PassiveTalent[];
}
import EnkaClient = require("../../client/EnkaClient");
import CharacterData = require("./CharacterData");
import Artifact = require("../artifact/Artifact");
import Weapon = require("../weapon/Weapon");
import CharacterStatus = require("./CharacterStatus");
import Constellation = require("./Constellation");
import Skill = require("./Skill");
import PassiveTalent = require("./PassiveTalent");
