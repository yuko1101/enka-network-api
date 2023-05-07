import { JsonManager, JsonObject } from "config_file.js";
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
    constructor(id: number, enka: EnkaClient, setData?: JsonManager) {

        this.enka = enka;

        this.id = id;

        const json = enka.cachedAssetsManager.getGenshinCacheData("ReliquaryExcelConfigData").find(p => p.getAsNumber("id") === this.id)?.detach();
        if (!json) throw new AssetsNotFoundError("Artifact", this.id);
        this._data = json.getAsJsonObject();

        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this.equipType = json.getAsString("equipType") as EquipType;

        const equipTypeJson = enka.cachedAssetsManager.getGenshinCacheData("ManualTextMapConfigData").find(p => p.getAsString("textMapId") === this.equipType)?.detach();
        if (!equipTypeJson) throw new AssetsNotFoundError("Artifact Equip Type", this.equipType);
        this._equipTypeData = equipTypeJson.getAsJsonObject();

        this.equipTypeName = new TextAssets(equipTypeJson.getAsNumber("textMapContentTextMapHash"), enka);

        this.icon = new ImageAssets(json.getAsString("icon"), enka);

        this.stars = json.getAsNumber("rankLevel");

        this.set = new ArtifactSet(json.getAsNumber("setId"), enka, setData);

    }
}

export default ArtifactData;