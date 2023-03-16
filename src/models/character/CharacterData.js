// eslint-disable-next-line no-unused-vars
const EnkaClient = require("../../client/EnkaClient");
const ImageAssets = require("../assets/ImageAssets");
const TextAssets = require("../assets/TextAssets");
// eslint-disable-next-line no-unused-vars
const Element = require("../Element");
const Skill = require("./talents/Skill");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const Constellation = require("./Constellation");
const ElementalBurst = require("./talents/ElementalBurst");
const Costume = require("./Costume");
const PassiveTalent = require("./talents/PassiveTalent");
const ElementalSkill = require("./talents/ElementalSkill");
const NormalAttack = require("./talents/NormalAttack");
const NameCard = require("../material/NameCard");
const CharacterDetails = require("./CharacterDetails");
const CharacterAscension = require("./CharacterAscension");

/**
 * @en CharacterData
 */
class CharacterData {

    /**
     * @param {number} id
     * @param {EnkaClient} enka
     * @param {number} [candSkillDepotIds]
     */
    constructor(id, enka, candSkillDepotId = undefined) {

        /** @type {number} */
        this.id = id;

        /** @type {EnkaClient} */
        this.enka = enka;


        /** @type {Object<string, any>} */
        this._data = enka.cachedAssetsManager.getGenshinCacheData("AvatarExcelConfigData").find(c => c.id === id);

        if (!this._data) throw new AssetsNotFoundError("Character", id);


        /** @type {TextAssets} */
        this.name = new TextAssets(this._data.nameTextMapHash, enka);

        /** @type {TextAssets} */
        this.description = new TextAssets(this._data.descTextMapHash, enka);

        /** @type {"BODY_MALE" | "BODY_BOY" | "BODY_LADY" | "BODY_GIRL" | "BODY_LOLI"} */
        this.bodyType = this._data.bodyType;

        /** @type {"WEAPON_SWORD_ONE_HAND" | "WEAPON_CLAYMORE" | "WEAPON_POLE" | "WEAPON_CATALYST" | "WEAPON_BOW"} */
        this.weaponType = this._data.weaponType;

        /** @type {"MALE" | "FEMALE"} */
        this.gender = this.bodyType === "BODY_MALE" || this.bodyType === "BODY_BOY" ? "MALE" : "FEMALE";

        /** @type {string} */
        this._nameId = this._data.iconName.slice("UI_AvatarIcon_".length);

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.iconName, enka);

        /** @type {ImageAssets} */
        this.sideIcon = new ImageAssets(this._data.sideIconName, enka);

        /** @type {ImageAssets} */
        this.splashImage = new ImageAssets(`UI_Gacha_AvatarImg_${this._nameId}`, enka);

        /**
         * Travelers do not have this.
         * @type {ImageAssets}
         */
        this.gachaSlice = new ImageAssets(`UI_Gacha_AvatarIcon_${this._nameId}`, enka);

        /** @type {ImageAssets} */
        this.cardIcon = new ImageAssets(`UI_AvatarIcon_${this._nameId}_Card`, enka);

        // TODO: better find
        const nameCardData = enka.cachedAssetsManager.getGenshinCacheData("MaterialExcelConfigData").find(m => m.materialType === "MATERIAL_NAMECARD" && m.picPath[0] && new RegExp(`^UI_NameCardPic_${this._nameId}[0-9]*_Alpha$`).test(m.picPath[0]));

        /**
         * If the character is Traveler, this will be null.
         * @type {NameCard | null}
         */
        this.nameCard = nameCardData ? new NameCard(nameCardData.id, enka, nameCardData) : null;

        /** @type {"QUALITY_ORANGE" | "QUALITY_PURPLE" | "QUALITY_ORANGE_SP"} */
        this.rarity = this._data.qualityType;

        /** @type {number} */
        this.stars = this.rarity.startsWith("QUALITY_ORANGE") ? 5 : 4;

        const keysManager = enka.cachedAssetsManager.getObjectKeysManager();

        /** @type {Array<Object<string, any>>} */
        this._costumeData = enka.cachedAssetsManager.getGenshinCacheData("AvatarCostumeExcelConfigData").filter(c => c[keysManager.costumeCharacterIdKey] === id); // Previous key of "jsonName"

        /** @type {Array<Costume>} */
        this.costumes = this._costumeData.map(c => new Costume(null, enka, c));


        /** @type {number} */
        this.skillDepotId = candSkillDepotId || this._data.skillDepotId;

        /** @type {Object<string, any>} */
        this._skillData = enka.cachedAssetsManager.getGenshinCacheData("AvatarSkillDepotExcelConfigData").find(s => s.id === this.skillDepotId);

        if (!this._skillData) throw new AssetsNotFoundError("Skill Depot", this.skillDepotId);

        // if the character is "Traveler" and no skillDepotId (which indicates its element type) provided,
        // `elementalBurst` and `element` cannot be retrieved.
        const hasElement = this._skillData.energySkill;

        /** @type {ElementalBurst | null} */
        this.elementalBurst = hasElement ? new ElementalBurst(this._skillData.energySkill, enka) : null;

        /** @type {Element | null} */
        this.element = hasElement ? this.elementalBurst.costElemType : null;

        const _skills = this._skillData.skills.map((skillId, index) => {
            if (!skillId) return null;
            if (index === 0) return new NormalAttack(skillId, enka);
            if (index === 1) return new ElementalSkill(skillId, enka);
            return new Skill(skillId, enka);
        }).filter(s => s !== null);
        if (this.elementalBurst) _skills.push(this.elementalBurst);

        /** @type {Array<Skill>} */
        this.skills = _skills;

        /**
         * Can be null if the character doesn't have element such as traveler without elements
         * @type {ElementalSkill | null}
         */
        this.elementalSkill = _skills.find(s => s instanceof ElementalSkill) ?? null;

        /** @type {NormalAttack} */
        this.normalAttack = _skills.find(s => s instanceof NormalAttack);


        /** @type {Array<PassiveTalent>} */
        this.passiveTalents = this._skillData.inherentProudSkillOpens.filter(p => Object.keys(p).includes("proudSkillGroupId")).map(p => new PassiveTalent(p.proudSkillGroupId * 100 + 1, enka)); // Number(`${p.proudSkillGroupId}01`)


        /** @type {Array<Constellation>} */
        this.constellations = this._skillData.talents.filter(cId => cId !== 0).map(cId => new Constellation(cId, enka));


        /** @type {object | null} */
        this._releaseData = enka.cachedAssetsManager.getGenshinCacheData("AvatarCodexExcelConfigData").find(r => r.avatarId === id) ?? null;

        /**
         * This is undefined if the character is not (being) released character, like Travelers and test avatars.
         * @type {Date | null}
         */
        this.releasedAt = this._releaseData ? new Date(`${this._releaseData.beginTime}+8:00`) : null;

        /**
         * Whether the character is playable.
         * @type {boolean}
         */
        this.isPlayable = this._data.useType === "AVATAR_FORMAL";

        const archonsIds = enka.cachedAssetsManager.getGenshinCacheData("TrialAvatarFetterDataConfigData").map(a => a.avatarId);

        /** @type {boolean} */
        this.isArchon = archonsIds.includes(this.id);

        let details;
        try {
            details = new CharacterDetails(null, enka, this.id, this.isArchon);
        } catch (e) {
            details = null;
        }
        /**
         * Information in the profile menu in in-game character screen.
         * @type {CharacterDetails | null}
         */
        this.details = details;

    }

    /**
     * Get character's original name (Travelers -> Aether, Lumine)
     * @returns {TextAssets}
     */
    getOriginalName() {
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
     * @param {number} ascension
     * @returns {CharacterAscension}
     */
    getAscensionData(ascension) {
        return new CharacterAscension(this._data.avatarPromoteId, ascension, this.enka);
    }
}

module.exports = CharacterData;
