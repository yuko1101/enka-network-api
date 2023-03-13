// eslint-disable-next-line no-unused-vars
const EnkaClient = require("../../client/EnkaClient");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const ImageAssets = require("../assets/ImageAssets");
const TextAssets = require("../assets/TextAssets");
const ArtifactSetBonus = require("./ArtifactSetBonus");

/**
 * @en ArtifactSet
 */
class ArtifactSet {

    /**
     * @param {number} id
     * @param {EnkaClient} enka
     * @param {Object<string, any>} [data]
     */
    constructor(id, enka, data = null) {

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {number} */
        this.id = data?.setId ?? id;

        /** @type {Object<string, any>} */
        this._data = data ?? enka.cachedAssetsManager.getGenshinCacheData("ReliquarySetExcelConfigData").find(s => s.setId === id);

        if (!this._data) throw new AssetsNotFoundError("ArtifactSet", id);

        /** @type {Array<Object<string, any>>} */
        this._setBonusData = enka.cachedAssetsManager.getGenshinCacheData("EquipAffixExcelConfigData").filter(bonus => bonus.id === this._data.EquipAffixId);

        if (this._setBonusData.length === 0) throw new AssetsNotFoundError("Artifact Set Bonus", `${this.id}-${this._data.EquipAffixId}`);
        if (this._setBonusData.length !== this._data.setNeedNum.length) throw new Error(`Missing some set bonus for this artifact set (ID: ${id})`);

        /** @type {Array<ArtifactSetBonus>} */
        this.setBonus = this._data.setNeedNum.map((n, i) => new ArtifactSetBonus(n, this._setBonusData[i], enka));

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.setIcon);

        /** @type {TextAssets} */
        this.name = new TextAssets(this._setBonusData[0].nameTextMapHash, enka);


    }
}

module.exports = ArtifactSet;