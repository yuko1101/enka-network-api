// eslint-disable-next-line no-unused-vars
const EnkaClient = require("../client/EnkaClient");
const AssetsNotFoundError = require("../errors/AssetsNotFoundError");
const TextAssets = require("./assets/TextAssets");

/**
 * @en Element
 */
class Element {

    /**
     * @param {ElementType} id
     * @param {EnkaClient} enka
     */
    constructor(id, enka) {

        /** @type {ElementType} */
        this.id = id;

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {Object<string, any>} */
        this._data = enka.cachedAssetsManager.getGenshinCacheData("ManualTextMapConfigData").find(t => t.textMapId === id);
        if (!this._data) throw new AssetsNotFoundError("Element", id);

        /** @type {TextAssets} */
        this.name = new TextAssets(this._data.textMapContentTextMapHash, enka);
    }
}

module.exports = Element;

/**
 * @en ElementType
 * @typedef ElementType
 * @type {"Wind"|"Rock"|"Electric"|"Grass"|"Water"|"Fire"|"Ice"}
 * @example
 * |ElementType|In-game Name|
 * |---|---|
 * |Wind|Anemo|
 * |Rock|Geo|
 * |Electric|Electro|
 * |Grass|Dendro|
 * |Water|Hydro|
 * |Fire|Pyro|
 * |Ice|Cryo|
 */