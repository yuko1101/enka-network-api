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
    constructor(id: number, enka: EnkaClient, candSkillDepotId?: undefined);
    /** @type {number} */
    id: number;
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {Object<string, any>} */
    _data: {
        [x: string]: any;
    };
    /** @type {TextAssets} */
    name: TextAssets;
    /** @type {TextAssets} */
    description: TextAssets;
    /** @type {"BODY_MALE" | "BODY_BOY" | "BODY_LADY" | "BODY_GIRL" | "BODY_LOLI"} */
    bodyType: "BODY_MALE" | "BODY_BOY" | "BODY_LADY" | "BODY_GIRL" | "BODY_LOLI";
    /** @type {import("../weapon/WeaponData").WeaponType} */
    weaponType: import("../weapon/WeaponData").WeaponType;
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
     * @type {ImageAssets}
     */
    gachaSlice: ImageAssets;
    /** @type {ImageAssets} */
    cardIcon: ImageAssets;
    /**
     * If the character is Traveler, this will be null.
     * @type {NameCard | null}
     */
    nameCard: NameCard | null;
    /** @type {"QUALITY_ORANGE" | "QUALITY_PURPLE" | "QUALITY_ORANGE_SP"} */
    rarity: "QUALITY_ORANGE" | "QUALITY_PURPLE" | "QUALITY_ORANGE_SP";
    /** @type {number} */
    stars: number;
    /** @type {Array<Object<string, any>>} */
    _costumeData: Array<{
        [x: string]: any;
    }>;
    /** @type {Array<Costume>} */
    costumes: Array<Costume>;
    /** @type {number} */
    skillDepotId: number;
    /** @type {Object<string, any>} */
    _skillData: {
        [x: string]: any;
    };
    /** @type {ElementalBurst | null} */
    elementalBurst: ElementalBurst | null;
    /** @type {Element | null} */
    element: Element | null;
    /** @type {Array<Skill>} */
    skills: Array<Skill>;
    /**
     * Can be null if the character doesn't have element such as traveler without elements
     * @type {ElementalSkill | null}
     */
    elementalSkill: ElementalSkill | null;
    /** @type {NormalAttack} */
    normalAttack: NormalAttack;
    /** @type {Array<PassiveTalent>} */
    passiveTalents: Array<PassiveTalent>;
    /** @type {Array<Constellation>} */
    constellations: Array<Constellation>;
    /** @type {object | null} */
    _releaseData: object | null;
    /**
     * This is undefined if the character is not (being) released character, like Travelers and test avatars.
     * @type {Date | null}
     */
    releasedAt: Date | null;
    /**
     * Whether the character is playable.
     * @type {boolean}
     */
    isPlayable: boolean;
    /** @type {boolean} */
    isArchon: boolean;
    /**
     * Information in the profile menu in in-game character screen.
     * @type {CharacterDetails | null}
     */
    details: CharacterDetails | null;
    /**
     * Get character's original name (Travelers -> Aether, Lumine)
     * @returns {TextAssets}
     */
    getOriginalName(): TextAssets;
    /**
     * @param {number} ascension
     * @returns {CharacterAscension}
     */
    getAscensionData(ascension: number): CharacterAscension;
}
import EnkaClient = require("../../client/EnkaClient");
import TextAssets = require("../assets/TextAssets");
import ImageAssets = require("../assets/ImageAssets");
import NameCard = require("../material/NameCard");
import Costume = require("./Costume");
import ElementalBurst = require("./talents/ElementalBurst");
import Element = require("../Element");
import Skill = require("./talents/Skill");
import ElementalSkill = require("./talents/ElementalSkill");
import NormalAttack = require("./talents/NormalAttack");
import PassiveTalent = require("./talents/PassiveTalent");
import Constellation = require("./Constellation");
import CharacterDetails = require("./CharacterDetails");
import CharacterAscension = require("./CharacterAscension");
