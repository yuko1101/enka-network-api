const EnkaClient = require("../../client/EnkaClient");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const ImageAssets = require("../assets/ImageAssets");
const TextAssets = require("../assets/TextAssets");

/** 
 * @en ArtifactData
 */
class ArtifactData {

    /** 
     * @param {number} id
     * @param {number} setNameTextMapHash
     * @param {EnkaClient} enka
     */
    constructor(id, setNameTextMapHash, enka) {

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {number} */
        this.id = id;


        /** @type {object} */
        this._data = enka.cachedAssetsManager.getGenshinCacheData("ReliquaryExcelConfigData").find(a => a.id === id);

        if (!this._data) throw new AssetsNotFoundError("Artifact", id);

        /** @type {TextAssets} */
        this.name = new TextAssets(this._data.nameTextMapHash, enka);

        /** @type {TextAssets} */
        this.description = new TextAssets(this._data.descTextMapHash, enka);

        /** @type {object} */
        this._setData = enka.cachedAssetsManager.getGenshinCacheData("EquipAffixExcelConfigData").find(s => s.nameTextMapHash === setNameTextMapHash);

        if (!this._setData) throw new AssetsNotFoundError("Artifact Set with nameTextMapHash", setNameTextMapHash);

        /** @type {TextAssets} */
        this.setName = new TextAssets(this._setData.nameTextMapHash, enka);

        /** @type {TextAssets} */
        this.setDescription = new TextAssets(this._setData.descTextMapHash, enka);

        /** @type {"EQUIP_BRACER" | "EQUIP_NECKLACE" | "EQUIP_SHOES" | "EQUIP_RING" | "EQUIP_DRESS" } Flower of Life, Plume of Death, Sands of Eon, Goblet of Eonothem, Circlet of Logos */
        this.equipType = this._data.equipType;

        /** @type {object} */
        this._equipTypeData = enka.cachedAssetsManager.getGenshinCacheData("ManualTextMapConfigData").find(t => t.textMapId === this.equipType);
        if (!this._equipTypeData) throw new AssetsNotFoundError("Artifact Equip Type", this.equipType);

        /** @type {TextAssets} */
        this.equiqTypeName = new TextAssets(this._equipTypeData.textMapContentTextMapHash, enka);

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.icon);

        /** @type {number} */
        this.stars = this._data.rankLevel;

    }
}

module.exports = ArtifactData;