const AssetsNotFoundError = require("../../../errors/AssetsNotFoundError");
const ImageAssets = require("../../assets/ImageAssets");
const TextAssets = require("../../assets/TextAssets");
const StatusProperty = require("../../StatusProperty");

/**
 * @en PassiveTalent
 */
class PassiveTalent {

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
        this._data = enka.cachedAssetsManager.getGenshinCacheData("ProudSkillExcelConfigData").find(p => p.proudSkillId === id);

        if (!this._data) throw new AssetsNotFoundError("Talent", id);


        /** @type {TextAssets} */
        this.name = new TextAssets(this._data.nameTextMapHash, enka);

        /** @type {TextAssets} */
        this.description = new TextAssets(this._data.descTextMapHash, enka);

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.icon, enka);

        /** @type {Array<StatusProperty>} */
        this.addProps = this._data.addProps.filter(p => Object.keys(p).includes("propType") && Object.keys(p).includes("value")).map(p => new StatusProperty(p.propType, p.value, enka));

        /**
         * Whether the talent is hidden in the list of talents on the in-game character screen.
         * e.g. Raiden Shogun's talent of not being able to cook. (Talent ID: 522301)
         * @type {boolean}
         */
        this.isHidden = this._data[enka.cachedAssetsManager.getObjectKeysManager().talentIsHiddenKey] ?? false;

    }
}

module.exports = PassiveTalent;