export = CharacterAscension;
/**
 * @en CharacterAscension
 */
declare class CharacterAscension {
    /**
     * @param {number} id avatarPromoteId
     * @param {number} ascension promoteLevel
     * @param {import("../../client/EnkaClient")} enka
     * @param {Object<string, any>} [data] If `data` provided, use `data` instead of searching with `id`.
     */
    constructor(id: number, ascension: number, enka: import("../../client/EnkaClient"), data?: {
        [x: string]: any;
    } | undefined);
    /** @type {number} */
    id: number;
    /** @type {number} */
    ascension: number;
    /** @type {import("../../client/EnkaClient")} */
    enka: import("../../client/EnkaClient");
    /** @type {Object<string, any>} */
    _data: {
        [x: string]: any;
    };
    /** @type {number} */
    unlockMaxLevel: number;
    /** @type {number} */
    requiredPlayerLevel: number;
    /** @type {UpgradeCost} */
    cost: UpgradeCost;
    /** @type {Array<StatusProperty>} */
    addProps: Array<StatusProperty>;
}
import UpgradeCost = require("../material/UpgradeCost");
import StatusProperty = require("../StatusProperty");
