export = CharacterData;
declare class CharacterData {
    /**
     * @param {number} id
     * @param {EnkaClient} enka
     * @param {number} [candSkillDepotIds]
     */
    constructor(id: number, enka: EnkaClient, candSkillDepotId?: any);
    /** @type {number} */
    id: number;
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {object} */
    _data: object;
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
    /** @type {object[]} */
    _costumeData: object[];
    /** @type {Costume[]} */
    costumes: Costume[];
    /** @type {number} */
    skillDepotId: number;
    /** @type {object} */
    _skillData: object;
    /** @type {Skill[]} */
    skills: Skill[];
    /** @type {ElementalBurst} */
    elementalBurst: ElementalBurst;
    /** @type {Element} */
    element: Element;
    /** @type {PassiveTalent[]} */
    passiveTalents: PassiveTalent[];
    /** @type {Constellation[]} */
    constellations: Constellation[];
}
import EnkaClient = require("../../client/EnkaClient");
import TextAssets = require("../assets/TextAssets");
import ImageAssets = require("../assets/ImageAssets");
import Costume = require("./Costume");
import Skill = require("./Skill");
import ElementalBurst = require("./ElementalBurst");
import Element = require("../Element");
import PassiveTalent = require("./PassiveTalent");
import Constellation = require("./Constellation");
