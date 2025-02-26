import { JsonReader, JsonObject } from "config_file.js";
import { EnkaClient } from "../../client/EnkaClient";
import { AssetsNotFoundError } from "../../errors/AssetsNotFoundError";
import { ImageAssets } from "../assets/ImageAssets";
import { TextAssets } from "../assets/TextAssets";
import { ArtifactSet } from "./ArtifactSet";
import { excelJsonOptions } from "../../client/CachedAssetsManager";

/**
 * EquipType|In-game Name
 * ---|---
 * EQUIP_BRACER|Flower of Life
 * EQUIP_NECKLACE|Plume of Death
 * EQUIP_SHOES|Sands of Eon
 * EQUIP_RING|Goblet of Eonothem
 * EQUIP_DRESS|Circlet of Logos
 */
export type EquipType = "EQUIP_BRACER" | "EQUIP_NECKLACE" | "EQUIP_SHOES" | "EQUIP_RING" | "EQUIP_DRESS";

export class ArtifactData {
    readonly enka: EnkaClient;
    readonly id: number;
    readonly name: TextAssets;
    readonly description: TextAssets;
    readonly equipType: EquipType;
    readonly equipTypeName: TextAssets;
    readonly icon: ImageAssets;
    readonly stars: number;
    readonly set: ArtifactSet;

    readonly _data: JsonObject;
    readonly _equipTypeData: JsonObject;

    constructor(data: JsonObject, enka: EnkaClient, setData?: JsonObject) {
        this.enka = enka;
        this._data = data;

        const json = new JsonReader(excelJsonOptions, this._data);

        this.id = json.getAsNumber("id");

        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this.equipType = json.getAsString("equipType") as EquipType;

        const equipTypeJson = enka.cachedAssetsManager.getGenshinCacheData("ManualTextMapConfigData").findArray((_, p) => p.getAsString("textMapId") === this.equipType)?.[1];
        if (!equipTypeJson) throw new AssetsNotFoundError("Artifact Equip Type", this.equipType);
        this._equipTypeData = equipTypeJson.getAsJsonObject();

        this.equipTypeName = new TextAssets(equipTypeJson.getAsNumber("textMapContentTextMapHash"), enka);

        this.icon = new ImageAssets(json.getAsString("icon"), enka);

        this.stars = json.getAsNumber("rankLevel");

        this.set = setData ? new ArtifactSet(setData, enka) : ArtifactSet.getById(json.getAsNumber("setId"), enka);

    }

    static getById(id: number, enka: EnkaClient, setData?: JsonObject): ArtifactData {
        const json = enka.cachedAssetsManager.getGenshinCacheData("ReliquaryExcelConfigData").findArray((_, p) => p.getAsNumber("id") === id)?.[1];
        if (!json) throw new AssetsNotFoundError("Artifact", id);
        return new ArtifactData(json.getAsJsonObject(), enka, setData);
    }
}
