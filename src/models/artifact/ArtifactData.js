const EnkaClient = require("../../client/EnkaClient");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const ImageAssets = require("../assets/ImageAssets");
const TextAssets = require("../assets/TextAssets");

module.exports = class ArtifactData {
    /** 
     * @param {string} id
     * @param {EnkaClient} enka
     */
    constructor(id, setNameTextMapHash, enka) {

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {string} */
        this.id = id;


        /** @type {object} */
        this._data = require(enka.cachedAssetsManager.getAssetsPath("data", "artifacts"))[id];

        if (!this._data) throw new AssetsNotFoundError("Artifact", id);

        /** @type {TextAssets} */
        this.name = new TextAssets("artifacts", `${this._data.nameTextMapHash}`, enka);

        /** @type {TextAssets} */
        this.setName = new TextAssets("artifact_sets", `${setNameTextMapHash}`, enka);

        /** @type {"EQUIP_BRACER" | "EQUIP_SHOES" | "EQUIP_DRESS" } Flower of Life, Plume of Death, Sands of Eon, Goblet of Eonothem, Circlet of Logos */
        this.equiqType = this._data.equiqType;

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.icon);

        /** @type {number} */
        this.rankLevel = this._data.rankLevel;

    }
}