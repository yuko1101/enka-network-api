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
import NameCard from "../material/NameCard";
import CharacterDetails from "./CharacterDetails";
import CharacterAscension from "./CharacterAscension";
import EnkaClient from "../../client/EnkaClient";
import { JsonObject } from "config_file.js";
import Element from "../Element";

export type BodyType = "BODY_MALE" | "BODY_BOY" | "BODY_LADY" | "BODY_GIRL" | "BODY_LOLI";
export type Rarity = "QUALITY_ORANGE" | "QUALITY_PURPLE" | "QUALITY_ORANGE_SP";
export type Gender = "MALE" | "FEMALE";

/**
 * @en CharacterData
 */
export default class CharacterData {
    public id: number;
    public enka: EnkaClient;
    public _data: JsonObject;
    public name: TextAssets;
    public description: TextAssets;
    public bodyType: BodyType;
    public weaponType: WeaponType;
    public gender: Gender;
    public _nameId: string;
    public icon: ImageAssets;
    public sideIcon: ImageAssets;
    public splashImage: ImageAssets;
    public gachaSlice: ImageAssets;
    public cardIcon: ImageAssets;
    public nameCard: NameCard | null;
    public rarity: Rarity;
    public stars: number;
    public _costumeData: JsonObject[];
    public costumes: Costume[];
    public skillDepotId: number;
    public _skillData: JsonObject;
    public elementalBurst: ElementalBurst | null;
    public element: Element | null;
    public skills: Skill[];
    public elementalSkill: ElementalSkill | null;
    public normalAttack: NormalAttack;
    public passiveTalents: PassiveTalent[];
    public constellations: Constellation[];
    public _releaseData: JsonObject | null;
    public releasedAt: Date | null;
    public isPlayable: boolean;
    public isArchon: boolean;
    public details: CharacterDetails | null;

    constructor(id: number, enka: EnkaClient, candSkillDepotId?: number) {

        this.id = id;

        this.enka = enka;


        const _data: JsonObject | undefined = enka.cachedAssetsManager.getGenshinCacheData("AvatarExcelConfigData").find(c => c.id === id);
        if (!_data) throw new AssetsNotFoundError("Character", id);
        this._data = _data;

        this.name = new TextAssets(this._data.nameTextMapHash as number, enka);

        this.description = new TextAssets(this._data.descTextMapHash as number, enka);

        this.bodyType = this._data.bodyType as BodyType;

        this.weaponType = this._data.weaponType as WeaponType;

        this.gender = this.bodyType === "BODY_MALE" || this.bodyType === "BODY_BOY" ? "MALE" : "FEMALE";

        this._nameId = (this._data.iconName as string).slice("UI_AvatarIcon_".length);

        this.icon = new ImageAssets(this._data.iconName as string, enka);

        this.sideIcon = new ImageAssets(this._data.sideIconName as string, enka);

        this.splashImage = new ImageAssets(`UI_Gacha_AvatarImg_${this._nameId}`, enka);

        /**
         * Travelers do not have this.
         */
        this.gachaSlice = new ImageAssets(`UI_Gacha_AvatarIcon_${this._nameId}`, enka);

        this.cardIcon = new ImageAssets(`UI_AvatarIcon_${this._nameId}_Card`, enka);

        // TODO: better find
        const nameCardData = enka.cachedAssetsManager.getGenshinCacheData("MaterialExcelConfigData").find(m => m.materialType === "MATERIAL_NAMECARD" && m.picPath[0] && new RegExp(`^UI_NameCardPic_${this._nameId}[0-9]*_Alpha$`).test(m.picPath[0]));

        /**
         * If the character is Traveler, this will be null.
         */
        this.nameCard = nameCardData ? new NameCard(nameCardData.id, enka, nameCardData) : null;

        this.rarity = this._data.qualityType as Rarity;

        this.stars = this.rarity.startsWith("QUALITY_ORANGE") ? 5 : 4;

        const keysManager = enka.cachedAssetsManager.getObjectKeysManager();

        this._costumeData = enka.cachedAssetsManager.getGenshinCacheData("AvatarCostumeExcelConfigData").filter(c => c[keysManager.costumeCharacterIdKey] === id); // Previous key of "jsonName"

        this.costumes = this._costumeData.map(c => new Costume(null, enka, c));


        this.skillDepotId = candSkillDepotId || this._data.skillDepotId as number;

        const _skillData: JsonObject | undefined = enka.cachedAssetsManager.getGenshinCacheData("AvatarSkillDepotExcelConfigData").find(s => s.id === this.skillDepotId);
        if (!_skillData) throw new AssetsNotFoundError("Skill Depot", this.skillDepotId);
        this._skillData = _skillData;

        // if the character is "Traveler" and no skillDepotId (which indicates its element type) provided,
        // `elementalBurst` and `element` cannot be retrieved.
        const hasElement = this._skillData.energySkill;

        this.elementalBurst = hasElement ? new ElementalBurst(this._skillData.energySkill as number, enka) : null;

        this.element = this.elementalBurst?.costElemType ?? null;

        const _skills = (this._skillData.skills as number[]).map((skillId, index) => {
            if (!skillId) return null;
            if (index === 0) return new NormalAttack(skillId, enka);
            if (index === 1) return new ElementalSkill(skillId, enka);
            return new Skill(skillId, enka);
        }).filter(s => s !== null).map(s => s as NonNullable<typeof s>);
        if (this.elementalBurst) _skills.push(this.elementalBurst);

        this.skills = _skills;

        /**
         * Can be null if the character doesn't have element such as traveler without elements
         */
        this.elementalSkill = _skills.find(s => s instanceof ElementalSkill) as ElementalSkill ?? null;

        this.normalAttack = _skills.find(s => s instanceof NormalAttack) as NormalAttack;


        this.passiveTalents = (this._skillData.inherentProudSkillOpens as JsonObject[]).filter(p => Object.keys(p).includes("proudSkillGroupId")).map(p => new PassiveTalent(p.proudSkillGroupId as number * 100 + 1, enka)); // Number(`${p.proudSkillGroupId}01`)


        this.constellations = (this._skillData.talents as number[]).filter(cId => cId !== 0).map(cId => new Constellation(cId, enka));


        this._releaseData = enka.cachedAssetsManager.getGenshinCacheData("AvatarCodexExcelConfigData").find(r => r.avatarId === id) ?? null;

        /**
         * This is undefined if the character is not (being) released character, like Travelers and test avatars.
         */
        this.releasedAt = this._releaseData ? new Date(`${this._releaseData.beginTime}+8:00`) : null;

        /**
         * Whether the character is playable.
         */
        this.isPlayable = this._data.useType === "AVATAR_FORMAL";

        const archonsIds = enka.cachedAssetsManager.getGenshinCacheData("TrialAvatarFetterDataConfigData").map(a => a.avatarId);

        this.isArchon = archonsIds.includes(this.id);

        let details;
        try {
            details = new CharacterDetails(null, enka, this.id, this.isArchon);
        } catch (e) {
            details = null;
        }
        /**
         * Information in the profile menu in in-game character screen.
         */
        this.details = details;

    }

    /**
     * Get character's original name (Travelers -> Aether, Lumine)
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

    getAscensionData(ascension: number): CharacterAscension {
        return new CharacterAscension(this._data.avatarPromoteId, ascension, this.enka);
    }
}