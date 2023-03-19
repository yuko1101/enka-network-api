const AssetsNotFoundError = require("../../../errors/AssetsNotFoundError");
const ImageAssets = require("../../assets/ImageAssets");
const TextAssets = require("../../assets/TextAssets");

/**
 * @en Skill
 * @description Normal Attack, Elemental Skill, and Elemental Burst. Not including Passive Talents.
 */
class Skill {

    /**
     * @param {number} id
     * @param {import("../../../client/EnkaClient")} enka
     */
    constructor(id, enka) {

        /** @type {number} */
        this.id = id;

        /** @type {import("../../../client/EnkaClient")} */
        this.enka = enka;

        /** @type {Object<string, any>} */
        this._data = enka.cachedAssetsManager.getGenshinCacheData("AvatarSkillExcelConfigData").find(s => s.id === id);

        if (!this._data) throw new AssetsNotFoundError("Skill", id);

        /** @type {TextAssets} */
        this.name = new TextAssets(this._data.nameTextMapHash, enka);

        /** @type {TextAssets} */
        this.description = new TextAssets(this._data.descTextMapHash, enka);

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.skillIcon, enka);
    }
}

module.exports = Skill;