const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const ImageAssets = require("../assets/ImageAssets");
const TextAssets = require("../assets/TextAssets");

/**
 * @en Material
 */
class Material {

    /**
     * @param {number} id
     * @param {import("../../client/EnkaClient")} enka
     * @param {Object<string, any>} [data] If `data` provided, use `data` instead of searching with `id`.
     */
    constructor(id, enka, data = null) {
        /** @type {number} */
        this.id = id;

        /** @type {import("../../client/EnkaClient")} */
        this.enka = enka;

        /** @type {Object<string, any>} */
        this._data = data ?? enka.cachedAssetsManager.getGenshinCacheData("MaterialExcelConfigData").find(m => m.id === id);

        if (!this._data) throw new AssetsNotFoundError("Material", id);

        /** @type {TextAssets} */
        this.name = new TextAssets(this._data.nameTextMapHash, enka);

        /** @type {TextAssets} */
        this.description = new TextAssets(this._data.descTextMapHash, enka);

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.icon, enka);

        /** @type {Array<ImageAssets>} */
        this.pictures = this._data.picPath.map(name => new ImageAssets(name, enka));

        /** @type {"ITEM_VIRTUAL"|"ITEM_MATERIAL"} */
        this.itemType = this._data.itemType;

        /** @type {string | null} */
        this.materialType = this._data.materialType ?? null;

        /** @type {number} */
        this.stars = this._data.rankLevel;

    }

    /**
     * @param {number | string} id
     * @param {import("../../client/EnkaClient")} enka
     * @param {Object<string, any>} [data] If `data` provided, use `data` instead of searching with `id`.
     * @returns {Material}
     */
    static getMaterialById(id, enka, data) {
        if (isNaN(id)) throw new Error("Parameter `id` must be a number or a string number.");
        id = Number(id);
        /** @type {Object<string, any>} */
        const materialData = data ?? enka.cachedAssetsManager.getGenshinCacheData("MaterialExcelConfigData").find(m => m.id === id);
        if (!materialData) throw new AssetsNotFoundError("Material", id);

        const NameCard = require("./NameCard");

        switch (materialData.materialType) {
            case NameCard.MATERIAL_TYPE:
                return new NameCard(id, enka, materialData);
            default:
                return new Material(id, enka, materialData);
        }
    }
}

module.exports = Material;