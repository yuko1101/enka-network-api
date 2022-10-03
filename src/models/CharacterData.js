const EnkaClient = require("../client/EnkaClient");
const ImageAssets = require("./assets/ImageAssets");
const TextAssets = require("./assets/TextAssets");
const Element = require("./Element");
const Skill = require("./Skill");
const Talent = require("./Talent");

module.exports = class CharacterData {
    /** 
     * @param {string} id
     * @param {EnkaClient} enka
     */
    constructor(id, enka) {

        /** @type {string} */
        this.id = id;

        /** @type {EnkaClient} */
        this.enka = enka;


        /** @type {object} */
        this._data = require(enka.cachedAssetsManager.getAssetsPath("data", "characters"))[id];

        if (!this._data) throw new AssetsNotFoundError("Character", id);

        /** @type {TextAssets} */
        this.name = new TextAssets("characters", `${this._data.nameTextMapHash}`, enka);

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.iconName);

        /** @type {ImageAssets} */
        this.sideIcon = new ImageAssets(this._data.sideIconName);

        /** @type {"QUALITY_ORANGE" | "QUALITY_PURPLE" | "QUALITY_ORANGE_SP"} */
        this.qualityType = this._data.qualityType;

        /** @type {number} */
        this.stars = this.qualityType.startsWith("QUALITY_ORANGE") ? 5 : 4;

        /** @type {Element} */
        this.element = new Element(this._data.costElemType);

        /** @type {Skill[]} */
        this.skills = this._data.skills.map(id => new Skill(id, enka));

        /** @type {Talent[]} */
        this.talents = this._data.talents.map(id => new Talent(id, enka));
    }
}