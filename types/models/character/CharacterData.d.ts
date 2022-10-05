export = CharacterData;
declare class CharacterData {
    /**
     * @param {number} id
     * @param {EnkaClient} enka
     */
    constructor(id: number, enka: EnkaClient);
    /** @type {number} */
    id: number;
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {object} */
    _data: object;
    /** @type {object} */
    _skillData: object;
    /** @type {TextAssets} */
    name: TextAssets;
    /** @type {ImageAssets} */
    icon: ImageAssets;
    /** @type {ImageAssets} */
    sideIcon: ImageAssets;
    /** @type {"QUALITY_ORANGE" | "QUALITY_PURPLE" | "QUALITY_ORANGE_SP"} */
    qualityType: "QUALITY_ORANGE" | "QUALITY_PURPLE" | "QUALITY_ORANGE_SP";
    /** @type {number} */
    stars: number;
    /** @type {Skill[]} */
    skills: Skill[];
    /** @type {ElementalBurst} */
    elementalBurst: ElementalBurst;
    /** @type {Element} */
    element: Element;
    /** @type {Constellation[]} */
    constellations: Constellation[];
}
import EnkaClient = require("../../client/EnkaClient");
import TextAssets = require("../assets/TextAssets");
import ImageAssets = require("../assets/ImageAssets");
import Skill = require("./Skill");
import ElementalBurst = require("./ElementalBurst");
import Element = require("../Element");
import Constellation = require("./Constellation");
