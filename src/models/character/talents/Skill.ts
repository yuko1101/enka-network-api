import { JsonReader } from "config_file.js";
import { EnkaClient } from "../../../client/EnkaClient";
import { AssetsNotFoundError } from "../../../errors/AssetsNotFoundError";
import { ImageAssets } from "../../assets/ImageAssets";
import { TextAssets } from "../../assets/TextAssets";
import { DynamicTextAssets } from "../../assets/DynamicTextAssets";
import { ExcelJsonObject, excelJsonOptions } from "../../../client/ExcelTransformer";

/**
 * Normal Attack, Elemental Skill, and Elemental Burst. Not including Passive Talents.
 */
export class Skill {
    readonly id: number;
    readonly enka: EnkaClient;
    readonly name: TextAssets;
    readonly description: DynamicTextAssets;
    readonly icon: ImageAssets;

    readonly _data: ExcelJsonObject;

    constructor(data: ExcelJsonObject, enka: EnkaClient) {
        this.enka = enka;
        this._data = data;

        const json = new JsonReader(excelJsonOptions, this._data);

        this.id = json.getAsNumber("id");

        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        this.description = new DynamicTextAssets(json.getAsNumber("descTextMapHash"), {}, enka);

        this.icon = new ImageAssets(json.getAsString("skillIcon"), enka);
    }

    static getById(id: number, enka: EnkaClient): Skill {
        return new Skill(this._getJsonObjectById(id, enka), enka);
    }

    static _getJsonObjectById(id: number, enka: EnkaClient): ExcelJsonObject {
        const data = enka.cachedAssetsManager.getExcelData("AvatarSkillExcelConfigData", id);
        if (!data) throw new AssetsNotFoundError("Skill", id);
        return data;
    }
}
