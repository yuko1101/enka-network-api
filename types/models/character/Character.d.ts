export = Character;
/**
 * @en Character
 */
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
    characterData: CharacterData;
    /** @type {Costume} */
    costume: Costume;
    /** @type {Array<Artifact>} */
    artifacts: Array<Artifact>;
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
    /**
     * Traveler's friendship is always 1.
     *  @type {number}
     */
    friendship: number;
    /** @type {Array<Constellation>} */
    unlockedConstellations: Array<Constellation>;
    /** @type {Array<{skill: Skill, level: number}>} */
    skillLevels: {
        skill: Skill;
        level: number;
    }[];
    /** @type {Array<PassiveTalent>} */
    unlockedPassiveTalents: Array<PassiveTalent>;
}
import EnkaClient = require("../../client/EnkaClient");
import CharacterData = require("./CharacterData");
import Costume = require("./Costume");
import Artifact = require("../artifact/Artifact");
import Weapon = require("../weapon/Weapon");
import CharacterStatus = require("./CharacterStatus");
import Constellation = require("./Constellation");
import Skill = require("./Skill");
import PassiveTalent = require("./PassiveTalent");
