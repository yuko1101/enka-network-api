const EnkaClient = require("../../client/EnkaClient");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const ImageAssets = require("../assets/ImageAssets");
const TextAssets = require("../assets/TextAssets");

module.exports = class ArtifactData {
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
        this._data = require(enka.cachedAssetsManager.getJSONDataPath("ReliquaryExcelConfigData")).find(a => a.id === id);

        if (!this._data) throw new AssetsNotFoundError("Artifact", id);

        /** @type {TextAssets} */
        this.name = new TextAssets(this._data.nameTextMapHash, enka);

        /** @type {TextAssets} */
        this.setName = new TextAssets(setNameTextMapHash, enka);

        /** @type {"EQUIP_BRACER" | "EQUIP_NECKLACE" | "EQUIP_SHOES" | "EQUIP_RING" | "EQUIP_DRESS" } Flower of Life, Plume of Death, Sands of Eon, Goblet of Eonothem, Circlet of Logos */
        this.equipType = this._data.equipType;

        /** @type {object} */
        this._equipTypeData = require(enka.cachedAssetsManager.getJSONDataPath("ManualTextMapConfigData")).find(t => t.textMapId === this.equipType);
        if (!this._equipTypeData) throw new AssetsNotFoundError("Artifact Equip Type", this.equipType);

        /** @type {TextAssets} */
        this.equiqTypeName = new TextAssets(this._equipTypeData.textMapContentTextMapHash, enka);

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.icon);

        /** @type {number} */
        this.rankLevel = this._data.rankLevel;

    }
}