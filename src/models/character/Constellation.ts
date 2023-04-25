import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import ImageAssets from "../assets/ImageAssets";
import TextAssets from "../assets/TextAssets";
import StatusProperty from "../StatusProperty";

/**
 * @en Constellation
 */
export default class Constellation {

    /**
     * @param {number} id
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(id, enka) {

        /** @type {number} */
        this.id = id;

        /** @type {import("../../client/EnkaClient")} */
        this.enka = enka;

        /** @type {Object<string, any>} */
        this._data = enka.cachedAssetsManager.getGenshinCacheData("AvatarTalentExcelConfigData").find(c => c.talentId === id);

        if (!this._data) throw new AssetsNotFoundError("Talent", id);

        /** @type {TextAssets} */
        this.name = new TextAssets(this._data.nameTextMapHash, enka);

        /** @type {TextAssets} */
        this.description = new TextAssets(this._data.descTextMapHash, enka);

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.icon, enka);

        /** @type {Array<StatusProperty>} */
        this.addProps = this._data.addProps.filter(p => Object.keys(p).includes("propType") && Object.keys(p).includes("value")).map(p => new StatusProperty(p.propType, p.value, enka));

        /** @type {Array<number>} */
        this.paramList = this._data.paramList;
    }
}