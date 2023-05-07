import { JsonReader, JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import UpgradeCost from "../material/UpgradeCost";
import StatusProperty, { FightProp } from "../StatusProperty";

/**
 * @en CharacterAscension
 */
class CharacterAscension {
    /**  */
    readonly id: number;
    /**  */
    readonly ascension: number;
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly unlockMaxLevel: number;
    /**  */
    readonly requiredPlayerLevel: number;
    /**  */
    readonly cost: UpgradeCost;
    /**  */
    readonly addProps: StatusProperty[];

    readonly _data: JsonObject;

    /**
     * @param id avatarPromoteId
     * @param ascension promoteLevel
     * @param enka
     * @param data If this is provided, use this instead of searching with `id`.
     */
    constructor(id: number, ascension: number, enka: EnkaClient, data?: JsonReader) {
        this.id = id;

        this.ascension = ascension;

        this.enka = enka;

        const json = data ?? enka.cachedAssetsManager.getGenshinCacheData("AvatarPromoteExcelConfigData").findArray((_, p) => p.getAsNumber("avatarPromoteId") === this.id && p.getAsNumberWithDefault(0, "promoteLevel") === ascension)?.[1];
        if (!json) throw new AssetsNotFoundError("CharacterAscension", `${this.id}-${ascension}`);
        this._data = json.getAsJsonObject();

        this.unlockMaxLevel = json.getAsNumber("unlockMaxLevel");

        this.requiredPlayerLevel = json.getAsNumber("requiredPlayerLevel");

        this.cost = new UpgradeCost(json.getAsNumberWithDefault(0, "scoinCost"), json.has("costItems") ? json.get("costItems").mapArray((_, p) => p.getAsJsonObject()) : [], enka);

        this.addProps = json.get("addProps").filterArray((_, p) => p.has("propType") && p.has("value")).map(([, p]) => new StatusProperty(p.getAsString("propType") as FightProp, p.getAsNumber("value"), enka));
    }
}

export default CharacterAscension;