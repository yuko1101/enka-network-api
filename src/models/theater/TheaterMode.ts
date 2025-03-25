import { JsonReader } from "config_file.js";
import { EnkaClient } from "../../client/EnkaClient";
import { AssetsNotFoundError } from "../../errors/AssetsNotFoundError";
import { ExcelJsonObject, excelJsonOptions } from "../../client/ExcelTransformer";

export const theaterDifficulties = ["EASY", "NORMAL", "HARD", "VISIONARY"] as const;

export class TheaterMode {
    readonly enka: EnkaClient;

    readonly id: number;
    readonly difficulty: typeof theaterDifficulties[number];

    readonly _data: ExcelJsonObject;

    constructor(data: ExcelJsonObject, enka: EnkaClient) {
        this.enka = enka;
        this._data = data;

        const json = new JsonReader(excelJsonOptions, this._data);

        this.id = json.getAsNumber("difficultyId");

        this.difficulty = theaterDifficulties[json.getAsNumber("difficultyLevel") - 1];
    }

    static getById(id: number, enka: EnkaClient): TheaterMode {
        const data = enka.cachedAssetsManager.getExcelData("RoleCombatDifficultyExcelConfigData", id);
        if (!data) throw new AssetsNotFoundError("TheaterMode", id);

        return new TheaterMode(data, enka);
    }
}