export = Character;
/**
 * @en Character
 */
declare class Character {
    /**
     * @param {Object<string, any>} data
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(data: {
        [x: string]: any;
    }, enka: import("../../client/EnkaClient"));
    /** @type {import("../../client/EnkaClient")} */
    enka: import("../../client/EnkaClient");
    /** @type {Object<string, any>} */
    _data: {
        [x: string]: any;
    };
    /** @type {CharacterData} */
    characterData: CharacterData;
    /** @type {import("./Costume")} */
    costume: import("./Costume");
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
    /** @type {number} */
    stamina: number;
    /**
     * Traveler's friendship is always 1.
     *  @type {number}
     */
    friendship: number;
    /** @type {Array<import("./Constellation")>} */
    unlockedConstellations: Array<import("./Constellation")>;
    /** @type {Array<{skill: import("./talents/Skill"), level: SkillLevel}>} */
    skillLevels: {
        skill: import("./talents/Skill");
        level: SkillLevel;
    }[];
    /** @type {Array<import("./talents/PassiveTalent")>} */
    unlockedPassiveTalents: Array<import("./talents/PassiveTalent")>;
}
import CharacterData = require("./CharacterData");
import Artifact = require("../artifact/Artifact");
import Weapon = require("../weapon/Weapon");
import CharacterStatus = require("./CharacterStatus");
import SkillLevel = require("./talents/SkillLevel");
