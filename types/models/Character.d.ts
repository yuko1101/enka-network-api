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
}
import EnkaClient = require("../client/EnkaClient");
import CharacterData = require("./CharacterData");
import Artifact = require("./artifact/Artifact");
import Weapon = require("./Weapon");
