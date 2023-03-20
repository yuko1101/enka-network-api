export = Skill;
/**
 * @en Skill
 * @description Normal Attack, Elemental Skill, and Elemental Burst. Not including Passive Talents.
 */
declare class Skill {
    /**
     * @param {number} id
     * @param {import("../../../client/EnkaClient")} enka
     */
    constructor(id: number, enka: import("../../../client/EnkaClient"));
    /** @type {number} */
    id: number;
    /** @type {import("../../../client/EnkaClient")} */
    enka: import("../../../client/EnkaClient");
    /** @type {Object<string, any>} */
    _data: {
        [x: string]: any;
    };
    /** @type {TextAssets} */
    name: TextAssets;
    /** @type {TextAssets} */
    description: TextAssets;
    /** @type {ImageAssets} */
    icon: ImageAssets;
}
import TextAssets = require("../../assets/TextAssets");
import ImageAssets = require("../../assets/ImageAssets");
