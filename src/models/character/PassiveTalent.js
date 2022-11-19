const EnkaClient = require("../../client/EnkaClient");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const ImageAssets = require("../assets/ImageAssets");
const TextAssets = require("../assets/TextAssets");

/** 
 * @en PassiveTalent
 */
class PassiveTalent {

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
        this._data = require(enka.cachedAssetsManager.getJSONDataPath("ProudSkillExcelConfigData")).find(p => p.proudSkillId === id);

        if (!this._data) throw new AssetsNotFoundError("Talent", id);


        /** @type {TextAssets} */
        this.name = new TextAssets(this._data.nameTextMapHash, enka);

        /** @type {TextAssets} */
        this.description = new TextAssets(this._data.descTextMapHash, enka);

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.icon);

    }
}

module.exports = PassiveTalent;