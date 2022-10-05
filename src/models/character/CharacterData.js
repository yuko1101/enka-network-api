const EnkaClient = require("../../client/EnkaClient");
const ImageAssets = require("../assets/ImageAssets");
const TextAssets = require("../assets/TextAssets");
const Element = require("../Element");
const Skill = require("./Skill");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const Constellation = require("./Constellation");

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


        // TODO: add elemental burst


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

        // /** @type {Element} */
        // this.element = new Element(this._data.costElemType);

        /** @type {Skill[]} */
        this.skills = this._skillData.skills.filter(id => id !== 0).map(id => new Skill(id, enka));

        /** @type {Constellation[]} */
        this.constellations = this._skillData.talents.filter(id => id !== 0).map(id => new Constellation(id, enka));
    }
}