import ImageAssets from "../assets/ImageAssets";
import TextAssets from "../assets/TextAssets";
import Skill from "./talents/Skill";
import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import Constellation from "./Constellation";
import ElementalBurst from "./talents/ElementalBurst";
import Costume from "./Costume";
import PassiveTalent from "./talents/PassiveTalent";
import ElementalSkill from "./talents/ElementalSkill";
import NormalAttack from "./talents/NormalAttack";
import { NameCard } from "../material/Material";
import CharacterDetails from "./CharacterDetails";
import CharacterAscension from "./CharacterAscension";
import EnkaClient from "../../client/EnkaClient";
import { JsonReader, JsonObject } from "config_file.js";
import Element from "../Element";
import { WeaponType } from "../weapon/WeaponData";

/** @typedef */
export type BodyType = "BODY_MALE" | "BODY_BOY" | "BODY_LADY" | "BODY_GIRL" | "BODY_LOLI";
/** @typedef */
export type CharacterRarity = "QUALITY_ORANGE" | "QUALITY_PURPLE" | "QUALITY_ORANGE_SP";
/** @typedef */
export type Gender = "MALE" | "FEMALE";

/**
 * @en CharacterData
 */
class CharacterData {
    /**  */
    readonly id: number;
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly name: TextAssets;
    /**  */
    readonly description: TextAssets;
    /**  */
    readonly bodyType: BodyType;
    /**  */
    readonly weaponType: WeaponType;
    /**  */
    readonly gender: Gender;
    /**  */
    readonly icon: ImageAssets;
    /**  */
    readonly sideIcon: ImageAssets;
    /**  */
    readonly splashImage: ImageAssets;
    /** This is not available for Travelers */
    readonly gachaSlice: ImageAssets;
    /**  */
    readonly cardIcon: ImageAssets;
    /** This will be null if the character is Traveler */
    readonly nameCard: NameCard | null;
    /**  */
    readonly rarity: CharacterRarity;
    /**  */
    readonly stars: number;
    /**  */
    readonly costumes: Costume[];
    /**  */
    readonly skillDepotId: number;
    /**  */
    readonly elementalBurst: ElementalBurst | null;
    /**  */
    readonly element: Element | null;
    /**  */
    readonly skills: Skill[];
    /** Can be null if the character doesn't have element such as traveler without elements */
    readonly elementalSkill: ElementalSkill | null;
    /**  */
    readonly normalAttack: NormalAttack;
    /**  */
    readonly passiveTalents: PassiveTalent[];
    /**  */
    readonly constellations: Constellation[];
    /** This will be null if the character is not (being) released character, like Travelers and test avatars */
    readonly releasedAt: Date | null;
    /**  */
    readonly isArchon: boolean;
    /** Information in the profile menu in in-game character screen */
    readonly details: CharacterDetails | null;

    readonly _data: JsonObject;
    readonly _nameId: string;
    readonly _skillData: JsonObject;
    readonly _costumeData: JsonObject[];
    readonly _releaseData: JsonObject | null;

    /**
     * @param id
     * @param enka
     * @param candSkillDepotId
     */
    constructor(id: number, enka: EnkaClient, candSkillDepotId?: number) {

        this.id = id;

        this.enka = enka;

        const json = enka.cachedAssetsManager.getGenshinCacheData("AvatarExcelConfigData").findArray((_, p) => p.getAsNumber("id") === this.id)?.[1];
        if (!json) throw new AssetsNotFoundError("Character", this.id);
        this._data = json.getAsJsonObject();

        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this.bodyType = json.getAsString("bodyType") as BodyType;

        this.weaponType = json.getAsString("weaponType") as WeaponType;

        this.gender = this.bodyType === "BODY_MALE" || this.bodyType === "BODY_BOY" ? "MALE" : "FEMALE";

        this._nameId = json.getAsString("iconName").slice("UI_AvatarIcon_".length);

        this.icon = new ImageAssets(json.getAsString("iconName"), enka);

        this.sideIcon = new ImageAssets(json.getAsString("sideIconName"), enka);

        this.splashImage = new ImageAssets(`UI_Gacha_AvatarImg_${this._nameId}`, enka);

        this.gachaSlice = new ImageAssets(`UI_Gacha_AvatarIcon_${this._nameId}`, enka);

        this.cardIcon = new ImageAssets(`UI_AvatarIcon_${this._nameId}_Card`, enka);

        // TODO: better find
        const nameCardData = enka.cachedAssetsManager.getGenshinCacheData("MaterialExcelConfigData").findArray((_, p) => p.has("materialType") && p.getAsString("materialType") === "MATERIAL_NAMECARD" && p.get("picPath").has(0) && new RegExp(`^UI_NameCardPic_${this._nameId}[0-9]*_Alpha$`).test(p.get("picPath", 0).getAsString()))?.[1];
        this.nameCard = nameCardData ? new NameCard(nameCardData.getAsNumber("id"), enka, nameCardData) : null;

        this.rarity = json.getAsString("qualityType") as CharacterRarity;

        this.stars = this.rarity.startsWith("QUALITY_ORANGE") ? 5 : 4;

        const keysManager = enka.cachedAssetsManager.getObjectKeysManager();

        const costumeData = enka.cachedAssetsManager.getGenshinCacheData("AvatarCostumeExcelConfigData").filterArray((_, p) => p.getAsNumber(keysManager.costumeCharacterIdKey) === this.id); // Previous key of "jsonName"
        this._costumeData = costumeData.map(([, p]) => p.getAsJsonObject());

        this.costumes = costumeData.map(([, p]) => new Costume(null, enka, p));


        this.skillDepotId = candSkillDepotId || json.getAsNumber("skillDepotId");

        const skillData = enka.cachedAssetsManager.getGenshinCacheData("AvatarSkillDepotExcelConfigData").findArray((_, p) => p.getAsNumber("id") === this.skillDepotId)?.[1];
        if (!skillData) throw new AssetsNotFoundError("Skill Depot", this.skillDepotId);
        this._skillData = skillData.getAsJsonObject();

        // if the character is "Traveler" and no skillDepotId (which indicates its element type) provided,
        // `elementalBurst`, `elementalSkill`, and `element` cannot be retrieved.
        const hasElement = skillData.has("energySkill");

        this.elementalBurst = hasElement ? new ElementalBurst(skillData.getAsNumber("energySkill"), enka) : null;

        this.element = this.elementalBurst?.costElemType ?? null;

        const _skills = skillData.get("skills").mapArray((_, p) => p.getAsNumber()).map((skillId, index) => {
            if (!skillId) return null;
            if (index === 0) return new NormalAttack(skillId, enka);
            if (index === 1) return new ElementalSkill(skillId, enka);
            return new Skill(skillId, enka);
        }).filter(s => s !== null).map(s => s as NonNullable<typeof s>);
        if (this.elementalBurst) _skills.push(this.elementalBurst);

        this.skills = _skills;

        this.elementalSkill = _skills.find(s => s instanceof ElementalSkill) as ElementalSkill ?? null;

        this.normalAttack = _skills.find(s => s instanceof NormalAttack) as NormalAttack;


        this.passiveTalents = skillData.get("inherentProudSkillOpens").filterArray((_, p) => p.has("proudSkillGroupId")).map(([, p]) => new PassiveTalent(p.getAsNumber("proudSkillGroupId") * 100 + 1, enka)); // Number(`${p.proudSkillGroupId}01`)


        this.constellations = skillData.get("talents").mapArray((_, p) => p.getAsNumber()).filter(cId => cId !== 0).map(cId => new Constellation(cId, enka));


        const releaseData = enka.cachedAssetsManager.getGenshinCacheData("AvatarCodexExcelConfigData").findArray((_, p) => p.getAsNumber("avatarId") === this.id)?.[1];
        this._releaseData = releaseData?.getAsJsonObject() ?? null;

        this.releasedAt = releaseData ? new Date(`${releaseData.getAsString("beginTime")}+8:00`) : null;

        const archonsIds = enka.cachedAssetsManager.getGenshinCacheData("TrialAvatarFetterDataConfigData").mapArray((_, p) => p.getAsNumber("avatarId"));

        this.isArchon = archonsIds.includes(this.id);

        let details;
        try {
            details = new CharacterDetails(null, enka, this.id, this.isArchon);
        } catch (e) {
            details = null;
        }
        this.details = details;

    }

    /**
     * @returns character's original name (Travelers -> Aether, Lumine)
     */
    getOriginalName(): TextAssets {
        switch (this.id) {
            case 10000005:
                return new TextAssets(2329553598, this.enka);
            case 10000007:
                return new TextAssets(3241049361, this.enka);
            default:
                return this.name;
        }
    }

    /**
     * @param ascension ascension level (0-6)
     */
    getAscensionData(ascension: number): CharacterAscension {
        return new CharacterAscension(new JsonReader(this._data).getAsNumber("avatarPromoteId"), ascension, this.enka);
    }
}

export default CharacterData;