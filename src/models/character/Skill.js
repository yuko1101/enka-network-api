const EnkaClient = require("../../client/EnkaClient");
const ImageAssets = require("../assets/ImageAssets");
const TextAssets = require("../assets/TextAssets");

module.exports = class Skill {
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
        this._data = require(enka.cachedAssetsManager.getAssetsPath("data", "skills"))[id];

        if (!this._data) throw new AssetsNotFoundError("Skill", id);

        /** @type {TextAssets} */
        this.name = new TextAssets("skills", this._data.nameTextMapHash, enka);

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.skillIcon);
    }
}