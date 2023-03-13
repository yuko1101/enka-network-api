// eslint-disable-next-line no-unused-vars
const EnkaClient = require("../../../client/EnkaClient");
const AssetsNotFoundError = require("../../../errors/AssetsNotFoundError");
const ImageAssets = require("../../assets/ImageAssets");
const TextAssets = require("../../assets/TextAssets");

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


        /** @type {Object<string, any>} */
        this._data = enka.cachedAssetsManager.getGenshinCacheData("ProudSkillExcelConfigData").find(p => p.proudSkillId === id);

        if (!this._data) throw new AssetsNotFoundError("Talent", id);


        /** @type {TextAssets} */
        this.name = new TextAssets(this._data.nameTextMapHash, enka);

        /** @type {TextAssets} */
        this.description = new TextAssets(this._data.descTextMapHash, enka);

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.icon);

        /**
         * Whether the talent is hidden in the list of talents on the in-game character screen.
         * e.g. Raiden Shogun's talent of not being able to cook. (Talent ID: 522301)
         * @type {boolean}
         */
        this.isHidden = this._data[enka.cachedAssetsManager.getObjectKeysManager().talentIsHiddenKey] ?? false;

    }
}

module.exports = PassiveTalent;