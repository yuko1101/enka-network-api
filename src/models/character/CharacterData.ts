import { ImageAssets } from "../assets/ImageAssets";
import { TextAssets } from "../assets/TextAssets";
import { Skill } from "./talents/Skill";
import { AssetsNotFoundError } from "../../errors/AssetsNotFoundError";
import { Constellation } from "./Constellation";
import { ElementalBurst } from "./talents/ElementalBurst";
import { Costume } from "./Costume";
import { PassiveTalent } from "./talents/PassiveTalent";
import { ElementalSkill } from "./talents/ElementalSkill";
import { NormalAttack } from "./talents/NormalAttack";
import { Material, NameCard } from "../material/Material";
import { CharacterDetails } from "./CharacterDetails";
import { CharacterAscension } from "./CharacterAscension";
import { EnkaClient } from "../../client/EnkaClient";
import { JsonReader, JsonObject } from "config_file.js";
import { Element } from "../Element";
import { WeaponType } from "../weapon/WeaponData";
import { StatProperty, FightProp } from "../StatProperty";
import { nonNullable } from "../../utils/ts_utils";
import { excelJsonOptions } from "../../client/CachedAssetsManager";

export type BodyType = "BODY_MALE" | "BODY_BOY" | "BODY_LADY" | "BODY_GIRL" | "BODY_LOLI";
export type CharacterRarity = "QUALITY_ORANGE" | "QUALITY_PURPLE" | "QUALITY_ORANGE_SP";
export type Gender = "MALE" | "FEMALE";
export type Arkhe = "Pneuma" | "Ousia" | "Furina";

export class CharacterData {
    readonly id: number;
    readonly enka: EnkaClient;
    readonly name: TextAssets;
    readonly description: TextAssets;
    readonly bodyType: BodyType;
    readonly weaponType: WeaponType;
    readonly gender: Gender;
    readonly icon: ImageAssets;
    readonly sideIcon: ImageAssets;
    readonly splashImage: ImageAssets;
    /** This is not available for Travelers */
    readonly gachaSlice: ImageAssets;
    readonly cardIcon: ImageAssets;
    /** This will be null if the character is Traveler */
    readonly nameCard: NameCard | null;
    readonly rarity: CharacterRarity;
    readonly stars: number;
    readonly costumes: Costume[];
    readonly skillDepotId: number;
    readonly elementalBurst: ElementalBurst | null;
    readonly element: Element | null;
    readonly arkhe: Arkhe | null;
    readonly skills: Skill[];
    /** Can be null if the character doesn't have element such as traveler without elements */
    readonly elementalSkill: ElementalSkill | null;
    readonly normalAttack: NormalAttack;
    readonly passiveTalents: PassiveTalent[];
    readonly constellations: Constellation[];
    /** This will be null if the character is not (being) released character, like Travelers and test avatars */
    readonly releasedAt: Date | null;
    readonly isArchon: boolean;
    readonly isTraveler: boolean;
    /** Information in the profile menu in in-game character screen */
    readonly details: CharacterDetails | null;

    readonly _data: JsonObject;
    readonly _nameId: string;
    readonly _skillData: JsonObject;
    readonly _costumeData: JsonObject[];
    readonly _releaseData: JsonObject | null;

    constructor(data: JsonObject, enka: EnkaClient, candSkillDepotId?: number) {
        this._data = data;
        this.enka = enka;

        const json = new JsonReader(excelJsonOptions, this._data);

        this.id = json.getAsNumber("id");

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

        const friendshipRewardId = enka.cachedAssetsManager.getGenshinCacheData("FetterCharacterCardExcelConfigData").findArray((_, value) => value.getAsNumber("avatarId") === this.id)?.[1].getAsNumber("rewardId");
        const nameCardId = friendshipRewardId ? enka.cachedAssetsManager.getGenshinCacheData("RewardExcelConfigData").findArray((_, reward) => reward.getAsNumber("rewardId") === friendshipRewardId)?.[1].getAsNumber("rewardItemList", 0, "itemId") : undefined;
        this.nameCard = nameCardId ? Material.getMaterialById(nameCardId, enka) as NameCard : null;

        this.rarity = json.getAsString("qualityType") as CharacterRarity;

        this.stars = this.rarity.startsWith("QUALITY_ORANGE") ? 5 : 4;

        const costumeData = enka.cachedAssetsManager.getGenshinCacheData("AvatarCostumeExcelConfigData").filterArray((_, p) => p.getAsNumber("characterId") === this.id); // Previous key of "jsonName"
        this._costumeData = costumeData.map(([, p]) => p.getAsJsonObject());
        this.costumes = this._costumeData.map(c => new Costume(c, enka));

        this.skillDepotId = candSkillDepotId ?? json.getAsNumber("skillDepotId");

        const skillData = enka.cachedAssetsManager.getGenshinCacheData("AvatarSkillDepotExcelConfigData").findArray((_, p) => p.getAsNumber("id") === this.skillDepotId)?.[1];
        if (!skillData) throw new AssetsNotFoundError("Skill Depot", this.skillDepotId);
        this._skillData = skillData.getAsJsonObject();

        this.arkhe = skillData.getAsStringWithDefault(null, enka.cachedAssetsManager.getObjectKeysManager().characterArkheKey) as Arkhe | null;

        // if the character is "Traveler" and no skillDepotId (which indicates its element type) provided,
        // `elementalBurst`, `elementalSkill`, and `element` cannot be retrieved.
        const hasElement = skillData.has("energySkill");

        this.elementalBurst = hasElement ? ElementalBurst.getById(skillData.getAsNumber("energySkill"), enka) : null;

        this.element = this.elementalBurst?.costElemType ?? null;

        const _skills = skillData.get("skills").mapArray((_, p) => p.getAsNumber()).map((skillId, index) => {
            if (!skillId) return null;
            if (index === 0) return NormalAttack.getById(skillId, enka);
            if (index === 1) return ElementalSkill.getById(skillId, enka);
            return Skill.getById(skillId, enka);
        }).filter(nonNullable);
        if (this.elementalBurst) _skills.push(this.elementalBurst);

        this.skills = _skills;

        this.elementalSkill = _skills.find(s => s instanceof ElementalSkill) as ElementalSkill ?? null;

        this.normalAttack = _skills.find(s => s instanceof NormalAttack) as NormalAttack;

        this.passiveTalents = skillData.get("inherentProudSkillOpens").filterArray((_, p) => p.has("proudSkillGroupId")).map(([, p]) => PassiveTalent.getById(p.getAsNumber("proudSkillGroupId") * 100 + 1, enka)); // Number(`${p.proudSkillGroupId}01`)

        this.constellations = skillData.get("talents").mapArray((_, p) => p.getAsNumber()).filter(cId => cId !== 0).map(cId => Constellation.getById(cId, enka));

        const releaseData = enka.cachedAssetsManager.getGenshinCacheData("AvatarCodexExcelConfigData").findArray((_, p) => p.getAsNumber("avatarId") === this.id)?.[1];
        this._releaseData = releaseData?.getAsJsonObject() ?? null;
        this.releasedAt = releaseData ? new Date(`${releaseData.getAsString("beginTime")}+8:00`) : null;

        const archonsIds = enka.cachedAssetsManager.getGenshinCacheData("TrialAvatarFetterDataConfigData").mapArray((_, p) => p.getAsNumber("avatarId"));
        this.isArchon = archonsIds.includes(this.id);

        // should always 10000005 and 10000007
        const travelerIds = enka.cachedAssetsManager.getGenshinCacheData("AvatarHeroEntityExcelConfigData").mapArray((_, p) => p.getAsNumber("avatarId"));
        this.isTraveler = travelerIds.includes(this.id);

        let details;
        try {
            details = CharacterDetails.getByCharacterId(this.id, this.isArchon, this.enka);
        } catch {
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
     * @param ascension ascension level between 0 and 6
     */
    getAscensionData(ascension: number): CharacterAscension {
        return CharacterAscension.getById(new JsonReader(excelJsonOptions, this._data).getAsNumber("avatarPromoteId"), ascension, this.enka);
    }

    /**
     * @param ascension ascension level between 0 and 6
     * @param level character level between 1 and 90
     */
    getStats(ascension: number, level: number): StatProperty[] {
        if (ascension < 0 || 6 < ascension) throw new Error("Ascension levels must be between 0 and 6.");
        if (level < 1 || 90 < level) throw new Error("Character levels must be between 1 and 90.");
        const curve = this.enka.cachedAssetsManager.getGenshinCacheData("AvatarCurveExcelConfigData").get(level - 1, "curveInfos");
        const ascensionData = this.getAscensionData(ascension);

        const characterJson = new JsonReader(excelJsonOptions, this._data);

        const baseValues = {
            "FIGHT_PROP_BASE_HP": characterJson.getAsNumber("hpBase"),
            "FIGHT_PROP_BASE_ATTACK": characterJson.getAsNumber("attackBase"),
            "FIGHT_PROP_BASE_DEFENSE": characterJson.getAsNumber("defenseBase"),

            "FIGHT_PROP_CRITICAL": characterJson.getAsNumber("critical"),
            "FIGHT_PROP_CRITICAL_HURT": characterJson.getAsNumber("criticalHurt"),
        };

        const curves = characterJson.get("propGrowCurves");

        const statPropertiesWithBaseValues = Object.entries(baseValues).map(([fightProp, baseValue]) => {
            const curveData = curves.findArray((_, c) => c.getAsString("type") === fightProp)?.[1];
            const curveType = curveData?.getAsString("growCurve");
            const targetCurve = curveType ? curve.findArray((_, c) => c.getAsString("type") === curveType)?.[1] : null;

            const ascensionValue = ascensionData.addProps.find(p => p.fightProp === fightProp)?.value ?? 0;

            const value = baseValue * (targetCurve ? targetCurve.getAsNumber("value") : 1) + ascensionValue;

            return new StatProperty(fightProp as FightProp, value, this.enka);

        });

        const statPropertiesWithoutBaseValues = ascensionData.addProps.filter(p => !(baseValues as Record<string, number>)[p.fightProp]);

        const levelingProps = [...statPropertiesWithBaseValues, ...statPropertiesWithoutBaseValues];

        const talents = this.passiveTalents.filter(t => t.requiredAscension <= ascension && t.addProps.length > 0);
        return StatProperty.sumStatProperties([...levelingProps, ...talents.flatMap(t => t.addProps)], this.enka);

    }

    static getById(id: number, enka: EnkaClient, candSkillDepotId?: number): CharacterData {
        const json = enka.cachedAssetsManager.getGenshinCacheData("AvatarExcelConfigData").findArray((_, p) => p.getAsNumber("id") === id)?.[1];
        if (!json) throw new AssetsNotFoundError("Character", id);
        return new CharacterData(json.getAsJsonObject(), enka, candSkillDepotId);
    }
}
