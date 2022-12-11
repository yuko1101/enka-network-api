export = CharacterData;
/**
 * @en CharacterData
 */
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
    /** @type {TextAssets} */
    description: TextAssets;
    /** @type {"BODY_MALE" | "BODY_BOY" | "BODY_LADY" | "BODY_GIRL" | "BODY_LOLI"} */
    bodyType: "BODY_MALE" | "BODY_BOY" | "BODY_LADY" | "BODY_GIRL" | "BODY_LOLI";
    /** @type {"MALE" | "FEMALE"} */
    gender: "MALE" | "FEMALE";
    /** @type {string} */
    _nameId: string;
    /** @type {ImageAssets} */
    icon: ImageAssets;
    /** @type {ImageAssets} */
    sideIcon: ImageAssets;
    /** @type {ImageAssets} */
    splashImage: ImageAssets;
    /**
     * Travelers do not have this.
     *  @type {ImageAssets}
     */
    gachaSlice: ImageAssets;
    /** @type {"QUALITY_ORANGE" | "QUALITY_PURPLE" | "QUALITY_ORANGE_SP"} */
    rarity: "QUALITY_ORANGE" | "QUALITY_PURPLE" | "QUALITY_ORANGE_SP";
    /** @type {number} */
    stars: number;
    /** @type {Array<object>} */
    _costumeData: Array<object>;
    /** @type {Array<Costume>} */
    costumes: Array<Costume>;
    /** @type {number} */
    skillDepotId: number;
    /** @type {object} */
    _skillData: object;
    /** @type {ElementalBurst} */
    elementalBurst: ElementalBurst;
    /** @type {Element} */
    element: Element;
    /** @type {Array<Skill>} */
    skills: Array<Skill>;
    /** @type {Array<PassiveTalent>} */
    passiveTalents: Array<PassiveTalent>;
    /** @type {Array<Constellation>} */
    constellations: Array<Constellation>;
    /** @type {object | null} */
    _releaseData: object | null;
    /**
     * This is undefined if the character is not (being) released character, like Travelers and test avatars.
     * @type {Date}
     */
    releasedAt: Date;
    /**
     * Whether the character is playable.
     * @type {boolean}
     */
    isPlayable: boolean;
}
import EnkaClient = require("../../client/EnkaClient");
import TextAssets = require("../assets/TextAssets");
import ImageAssets = require("../assets/ImageAssets");
import Costume = require("./Costume");
import ElementalBurst = require("./talents/ElementalBurst");
import Element = require("../Element");
import Skill = require("./talents/Skill");
import PassiveTalent = require("./talents/PassiveTalent");
import Constellation = require("./Constellation");
