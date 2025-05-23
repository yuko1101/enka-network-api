import { JsonReader } from "config_file.js";
import { EnkaClient } from "../../client/EnkaClient";
import { AssetsNotFoundError } from "../../errors/AssetsNotFoundError";
import { UpgradeCost } from "../material/UpgradeCost";
import { StatProperty, FightProp } from "../StatProperty";
import { ExcelJsonObject, excelJsonOptions } from "../../client/ExcelTransformer";

export class CharacterAscension {
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

        this.id = json.getAsNumber("avatarPromoteId");
        this.ascension = json.getAsNumberWithDefault(0, "promoteLevel");

        this.unlockMaxLevel = json.getAsNumber("unlockMaxLevel");

        this.requiredAdventureRank = json.getAsNumberWithDefault(0, "requiredPlayerLevel");

        this.cost = new UpgradeCost(json.getAsNumberWithDefault(0, "scoinCost"), json.has("costItems") ? json.get("costItems").mapArray((_, p) => p.getAsJsonObject()) : [], enka);

        this.addProps = json.get("addProps").filterArray((_, p) => p.has("propType") && p.has("value")).map(([, p]) => new StatProperty(p.getAsString("propType") as FightProp, p.getAsNumber("value"), enka));
    }

    /**
     * @param id avatarPromoteId
     * @param ascension promoteLevel
     */
    static getById(id: number, ascension: number, enka: EnkaClient): CharacterAscension {
        const data = enka.cachedAssetsManager.getExcelData("AvatarPromoteExcelConfigData", id, ascension);
        if (!data) throw new AssetsNotFoundError("CharacterAscension", `${id}-${ascension}`);
        return new CharacterAscension(data, enka);
    }
}
