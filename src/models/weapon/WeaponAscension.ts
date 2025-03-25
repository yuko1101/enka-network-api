import { JsonReader } from "config_file.js";
import { EnkaClient } from "../../client/EnkaClient";
import { UpgradeCost } from "../material/UpgradeCost";
import { StatProperty, FightProp } from "../StatProperty";
import { AssetsNotFoundError } from "../../errors/AssetsNotFoundError";
import { ExcelJsonObject, excelJsonOptions } from "../../client/ExcelTransformer";

export class WeaponAscension {
    readonly id: number;
    readonly ascension: number;
    readonly enka: EnkaClient;

    readonly unlockMaxLevel: number;
    /** 0 if adventure rank is not required */
    readonly requiredAdventureRank: number;
    readonly cost: UpgradeCost;
    readonly addProps: StatProperty[];

    readonly _data: ExcelJsonObject;

    constructor(data: ExcelJsonObject, enka: EnkaClient) {
        this._data = data;
        this.enka = enka;

        const json = new JsonReader(excelJsonOptions, this._data);

        this.id = json.getAsNumber("weaponPromoteId");
        this.ascension = json.getAsNumberWithDefault(0, "promoteLevel");

        this.unlockMaxLevel = json.getAsNumber("unlockMaxLevel");

        this.requiredAdventureRank = json.getAsNumberWithDefault(0, "requiredPlayerLevel");

        this.cost = new UpgradeCost(json.getAsNumberWithDefault(0, "coinCost"), json.has("costItems") ? json.get("costItems").mapArray((_, p) => p.getAsJsonObject()) : [], enka);

        this.addProps = json.get("addProps").filterArray((_, p) => p.has("propType") && p.has("value")).map(([, p]) => new StatProperty(p.getAsString("propType") as FightProp, p.getAsNumber("value"), enka));
    }

    /**
     * @param id weaponPromoteId
     * @param ascension promoteLevel
     */
    static getById(id: number, ascension: number, enka: EnkaClient): WeaponAscension {
        const data = enka.cachedAssetsManager.getExcelData("WeaponPromoteExcelConfigData", id, ascension);
        if (!data) throw new AssetsNotFoundError("WeaponAscension", `${id}-${ascension}`);
        return new WeaponAscension(data, enka);
    }
}
