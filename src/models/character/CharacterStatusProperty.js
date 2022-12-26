const EnkaClient = require("../../client/EnkaClient");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const { percent } = require("../../utils/prop_utils");
const TextAssets = require("../assets/TextAssets");

/** 
 * @en CharacterStatusProperty
 */
class CharacterStatusProperty {

    /** 
     * @param {string} id
     * @param {number} value
     * @param {EnkaClient} enka
     */
    constructor(id, value, enka) {
        /** @type {string} */
        this.id = id;

        /** @type {object} */
        this._propData = enka.cachedAssetsManager.getGenshinCacheData("ManualTextMapConfigData").find(t => t.textMapId === id);
        if (!this._propData) throw new AssetsNotFoundError("Fight Prop", id);

        /** @type {TextAssets} */
        this.type = new TextAssets(this._propData.textMapContentTextMapHash, enka);

        /** @type {boolean} */
        this.isPercent = percent.includes(id);

        /** @type {number} */
        this.value = value;
    }
}

module.exports = CharacterStatusProperty;