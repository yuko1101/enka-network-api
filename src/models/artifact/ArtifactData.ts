import { JsonReader } from "config_file.js";
import { EnkaClient } from "../../client/EnkaClient";
import { AssetsNotFoundError } from "../../errors/AssetsNotFoundError";
import { ImageAssets } from "../assets/ImageAssets";
import { TextAssets } from "../assets/TextAssets";
import { ArtifactSet } from "./ArtifactSet";
import { ExcelJsonObject, excelJsonOptions } from "../../client/ExcelTransformer";

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

    readonly _data: ExcelJsonObject;
    readonly _equipTypeData: ExcelJsonObject;

    constructor(data: ExcelJsonObject, enka: EnkaClient, setData?: ExcelJsonObject) {
        this.enka = enka;
        this._data = data;

        const json = new JsonReader(excelJsonOptions, this._data);

        this.id = json.getAsNumber("id");

        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this.equipType = json.getAsString("equipType") as EquipType;

        const equipTypeJson = enka.cachedAssetsManager.getExcelData("ManualTextMapConfigData", this.equipType);
        if (!equipTypeJson) throw new AssetsNotFoundError("Artifact Equip Type", this.equipType);
        this._equipTypeData = equipTypeJson;

        this.equipTypeName = new TextAssets(new JsonReader(excelJsonOptions, equipTypeJson).getAsNumber("textMapContentTextMapHash"), enka);

        this.icon = new ImageAssets(json.getAsString("icon"), enka);

        this.stars = json.getAsNumber("rankLevel");

        this.set = setData ? new ArtifactSet(setData, enka) : ArtifactSet.getById(json.getAsNumber("setId"), enka);

    }

    static getById(id: number, enka: EnkaClient, setData?: ExcelJsonObject): ArtifactData {
        const data = enka.cachedAssetsManager.getExcelData("ReliquaryExcelConfigData", id);
        if (!data) throw new AssetsNotFoundError("Artifact", id);
        return new ArtifactData(data, enka, setData);
    }
}
