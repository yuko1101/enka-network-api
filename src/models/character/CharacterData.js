const EnkaClient = require("../../client/EnkaClient");
const ImageAssets = require("../assets/ImageAssets");
const TextAssets = require("../assets/TextAssets");
const Element = require("../Element");
const Skill = require("./Skill");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const Constellation = require("./Constellation");
const ElementalBurst = require("./ElementalBurst");
const Costume = require("./Costume");
const PassiveTalent = require("./PassiveTalent");

module.exports = class CharacterData {
    /** 
     * @param {number} id
     * @param {EnkaClient} enka
     */
    constructor(id, enka) {

        /** @type {number} */
        this.id = id;

        /** @type {EnkaClient} */
        this.enka = enka;


        /** @type {object} */
        this._data = require(enka.cachedAssetsManager.getJSONDataPath("AvatarExcelConfigData")).find(c => c.id === id);

        if (!this._data) throw new AssetsNotFoundError("Character", id);

        /** @type {object} */
        this._skillData = require(enka.cachedAssetsManager.getJSONDataPath("AvatarSkillDepotExcelConfigData")).find(s => s.id === this._data.skillDepotId);

        if (!this._skillData) throw new AssetsNotFoundError("Skill Depot", this._data.skillDepotId);

        /** @type {TextAssets} */
        this.name = new TextAssets(this._data.nameTextMapHash, enka);

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.iconName);

        /** @type {ImageAssets} */
        this.sideIcon = new ImageAssets(this._data.sideIconName);

        /** @type {"QUALITY_ORANGE" | "QUALITY_PURPLE" | "QUALITY_ORANGE_SP"} */
        this.qualityType = this._data.qualityType;

        /** @type {number} */
        this.stars = this.qualityType.startsWith("QUALITY_ORANGE") ? 5 : 4;

        /** @type {Skill[]} */
        this.skills = this._skillData.skills.filter(id => id !== 0).map(id => new Skill(id, enka));

        /** @type {ElementalBurst} */
        this.elementalBurst = new ElementalBurst(this._skillData.energySkill, enka);

        /** @type {PassiveTalent[]} */
        this.passiveTalents = this._skillData.inherentProudSkillOpens.filter(p => p.hasOwnProperty("proudSkillGroupId")).map(p => new PassiveTalent(p.proudSkillGroupId * 100 + 1, enka)); // Number(`${p.proudSkillGroupId}01`)

        /** @type {Element} */
        this.element = this.elementalBurst.costElemType;

        /** @type {Constellation[]} */
        this.constellations = this._skillData.talents.filter(id => id !== 0).map(id => new Constellation(id, enka));

        /** @type {object[]} */
        this._costumeData = require(enka.cachedAssetsManager.getJSONDataPath("AvatarCostumeExcelConfigData")).filter(c => c.AKOANLMAFDD === id);

        /** @type {Costume[]} */
        this.costumes = this._costumeData.map(c => new Costume(c.OGKFGGNLLDG, enka));


    }
}