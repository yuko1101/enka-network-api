const EnkaClient = require("../../client/EnkaClient");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const ImageAssets = require("../assets/ImageAssets");
const TextAssets = require("../assets/TextAssets");
const CharacterStatusProperty = require("./CharacterStatusProperty");

/** 
 * @en Constellation
 */
class Constellation {

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
        this._data = require(enka.cachedAssetsManager.getJSONDataPath("AvatarTalentExcelConfigData")).find(c => c.talentId === id);

        if (!this._data) throw new AssetsNotFoundError("Talent", id);

        /** @type {TextAssets} */
        this.name = new TextAssets(this._data.nameTextMapHash, enka);

        /** @type {TextAssets} */
        this.description = new TextAssets(this._data.descTextMapHash, enka);

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.icon);

        /** @type {Array<CharacterStatusProperty>} */
        this.addProps = this._data.addProps.filter(p => p.hasOwnProperty("propType") && p.hasOwnProperty("value")).map(p => new CharacterStatusProperty(p.propType, p.value, enka));

        /** @type {Array<number>} */
        this.paramList = this._data.paramList;
    }
}

module.exports = Constellation;