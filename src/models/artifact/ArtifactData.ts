import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import ImageAssets from "../assets/ImageAssets";
import TextAssets from "../assets/TextAssets";
import ArtifactSet from "./ArtifactSet";

/**
 * @typedef
 * @example
 * |EquipType|In-game Name|
 * |---|---|
 * |EQUIP_BRACER|Flower of Life|
 * |EQUIP_NECKLACE|Plume of Death|
 * |EQUIP_SHOES|Sands of Eon|
 * |EQUIP_RING|Goblet of Eonothem|
 * |EQUIP_DRESS|Circlet of Logos|
 */
export type EquipType = "EQUIP_BRACER" | "EQUIP_NECKLACE" | "EQUIP_SHOES" | "EQUIP_RING" | "EQUIP_DRESS";

/**
 * @en ArtifactData
 */
class ArtifactData {
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly id: number;
    /**  */
    readonly name: TextAssets;
    /**  */
    readonly description: TextAssets;
    /**  */
    readonly equipType: EquipType;
    /**  */
    readonly equipTypeName: TextAssets;
    /**  */
    readonly icon: ImageAssets;
    /**  */
    readonly stars: number;
    /**  */
    readonly set: ArtifactSet;

    readonly _data: JsonObject;
    readonly _equipTypeData: JsonObject;

    /**
     * @param id
     * @param enka
     * @param setData
     */
    constructor(id: number, enka: EnkaClient, setData?: JsonObject) {

        this.enka = enka;

        this.id = id;

        const _data: JsonObject | undefined = enka.cachedAssetsManager.getGenshinCacheData("ReliquaryExcelConfigData").find(a => a.id === this.id);
        if (!_data) throw new AssetsNotFoundError("Artifact", this.id);
        this._data = _data;

        this.name = new TextAssets(this._data.nameTextMapHash as number, enka);

        this.description = new TextAssets(this._data.descTextMapHash as number, enka);

        this.equipType = this._data.equipType as EquipType;

        const _equipTypeData: JsonObject | undefined = enka.cachedAssetsManager.getGenshinCacheData("ManualTextMapConfigData").find(t => t.textMapId === this.equipType);
        if (!_equipTypeData) throw new AssetsNotFoundError("Artifact Equip Type", this.equipType);
        this._equipTypeData = _equipTypeData;

        this.equipTypeName = new TextAssets(this._equipTypeData.textMapContentTextMapHash as number, enka);

        this.icon = new ImageAssets(this._data.icon as string, enka);

        this.stars = this._data.rankLevel as number;

        this.set = new ArtifactSet(this._data.setId as number, enka, setData);

    }
}

export default ArtifactData;