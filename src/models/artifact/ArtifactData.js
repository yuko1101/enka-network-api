// eslint-disable-next-line no-unused-vars
const EnkaClient = require("../../client/EnkaClient");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const ImageAssets = require("../assets/ImageAssets");
const TextAssets = require("../assets/TextAssets");
const ArtifactSet = require("./ArtifactSet");

/**
 * @en ArtifactData
 */
class ArtifactData {

    /**
     * @param {number} id
     * @param {EnkaClient} enka
     * @param {Object<string, any>} [setData]
     */
    constructor(id, enka, setData = null) {

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {number} */
        this.id = id;


        /** @type {Object<string, any>} */
        this._data = enka.cachedAssetsManager.getGenshinCacheData("ReliquaryExcelConfigData").find(a => a.id === id);

        if (!this._data) throw new AssetsNotFoundError("Artifact", id);

        /** @type {TextAssets} */
        this.name = new TextAssets(this._data.nameTextMapHash, enka);

        /** @type {TextAssets} */
        this.description = new TextAssets(this._data.descTextMapHash, enka);

        /** @type {"EQUIP_BRACER" | "EQUIP_NECKLACE" | "EQUIP_SHOES" | "EQUIP_RING" | "EQUIP_DRESS" } Flower of Life, Plume of Death, Sands of Eon, Goblet of Eonothem, Circlet of Logos */
        this.equipType = this._data.equipType;

        /** @type {Object<string, any>} */
        this._equipTypeData = enka.cachedAssetsManager.getGenshinCacheData("ManualTextMapConfigData").find(t => t.textMapId === this.equipType);
        if (!this._equipTypeData) throw new AssetsNotFoundError("Artifact Equip Type", this.equipType);

        /** @type {TextAssets} */
        this.equipTypeName = new TextAssets(this._equipTypeData.textMapContentTextMapHash, enka);

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.icon, enka);

        /** @type {number} */
        this.stars = this._data.rankLevel;

        /** @type {ArtifactSet} */
        this.set = new ArtifactSet(this._data.setId, enka, setData);

    }
}

module.exports = ArtifactData;