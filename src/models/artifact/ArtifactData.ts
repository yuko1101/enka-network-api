import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import ImageAssets from "../assets/ImageAssets";
import TextAssets from "../assets/TextAssets";
import ArtifactSet from "./ArtifactSet";

export type EquipType = "EQUIP_BRACER" | "EQUIP_NECKLACE" | "EQUIP_SHOES" | "EQUIP_RING" | "EQUIP_DRESS";

/**
 * @en ArtifactData
 */
export default class ArtifactData {
    public enka: EnkaClient;
    public id: number;
    public _data: JsonObject;
    public name: TextAssets;
    public description: TextAssets;
    public equipType: EquipType;
    public _equipTypeData: JsonObject;
    public equipTypeName: TextAssets;
    public icon: ImageAssets;
    public stars: number;
    public set: ArtifactSet;

    /**
     * @param {number} id
     * @param {import("../../client/EnkaClient")} enka
     * @param {Object<string, any>} [setData]
     */
    constructor(id: number, enka: EnkaClient, setData?: JsonObject) {

        this.enka = enka;

        this.id = id;

        const _data: JsonObject | undefined = enka.cachedAssetsManager.getGenshinCacheData("ReliquaryExcelConfigData").find(a => a.id === id);
        if (!_data) throw new AssetsNotFoundError("Artifact", id);
        this._data = _data;

        this.name = new TextAssets(this._data.nameTextMapHash as number, enka);

        this.description = new TextAssets(this._data.descTextMapHash as number, enka);

        /** Flower of Life, Plume of Death, Sands of Eon, Goblet of Eonothem, Circlet of Logos */
        this.equipType = this._data.equipType as EquipType;

        const _equipTypeData: JsonObject | undefined = enka.cachedAssetsManager.getGenshinCacheData("ManualTextMapConfigData").find(t => t.textMapId === this.equipType);
        if (!_equipTypeData) throw new AssetsNotFoundError("Artifact Equip Type", this.equipType);
        this._equipTypeData = _equipTypeData;

        /** @type {TextAssets} */
        this.equipTypeName = new TextAssets(this._equipTypeData.textMapContentTextMapHash as number, enka);

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.icon as string, enka);

        /** @type {number} */
        this.stars = this._data.rankLevel as number;

        /** @type {ArtifactSet} */
        this.set = new ArtifactSet(this._data.setId as number, enka, setData);

    }
}