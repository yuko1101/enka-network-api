import { JsonObject, JsonReader } from "config_file.js";
import { EnkaClient } from "../../client/EnkaClient";
import { AssetsNotFoundError } from "../../errors/AssetsNotFoundError";
import { excelJsonOptions } from "../../client/CachedAssetsManager";

export const theaterDifficulties = ["EASY", "NORMAL", "HARD", "VISIONARY"] as const;

export class TheaterMode {
    readonly enka: EnkaClient;

    readonly id: number;
    readonly difficulty: typeof theaterDifficulties[number];

    readonly _data: JsonObject;

    constructor(data: JsonObject, enka: EnkaClient) {
        this.enka = enka;
        this._data = data;

        const json = new JsonReader(excelJsonOptions, this._data);

        this.id = json.getAsNumber("difficultyId");

        this.difficulty = theaterDifficulties[json.getAsNumber("difficultyLevel") - 1];
    }

    static getById(id: number, enka: EnkaClient): TheaterMode {
        const theaterMode = enka.cachedAssetsManager.getGenshinCacheData("RoleCombatDifficultyExcelConfigData").findArray((_, p) => p.getAsNumber("difficultyId") === id)?.[1];
        if (!theaterMode) throw new AssetsNotFoundError("TheaterMode", id);

        return new TheaterMode(theaterMode.getAsJsonObject(), enka);
    }
}