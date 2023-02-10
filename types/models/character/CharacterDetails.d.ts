export = CharacterDetails;
/**
 * @en CharacterDetails
 */
declare class CharacterDetails {
    /**
     * @param {number} id
     * @param {EnkaClient} enka
     * @param {number} [characterId]
     */
    constructor(id: number, enka: EnkaClient, characterId?: number);
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {object} */
    _data: object;
    /** @type {number} */
    id: number;
}
import EnkaClient = require("../../client/EnkaClient");
