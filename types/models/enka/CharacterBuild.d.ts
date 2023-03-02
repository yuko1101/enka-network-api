export = CharacterBuild;
/**
 * @en CharacterBuild
 */
declare class CharacterBuild {
    /**
     * @param {object} data
     * @param {EnkaClient} enka
     */
    constructor(data: object, enka: EnkaClient);
    /** @type {object} */
    _data: object;
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {number} */
    id: number;
    /** @type {string} */
    name: string;
    /** @type {number} */
    order: number;
    /** @type {boolean} */
    isLive: boolean;
    /** @type {boolean} */
    isPublic: boolean;
    /** @type {Character} */
    character: Character;
}
import EnkaClient = require("../../client/EnkaClient");
import Character = require("../character/Character");
