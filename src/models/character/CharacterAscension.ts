import { JsonManager, JsonObject } from "config_file.js";
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
    constructor(id: number, ascension: number, enka: EnkaClient, data?: JsonManager) {
        this.id = id;

        this.ascension = ascension;

        this.enka = enka;

        const json = data ?? enka.cachedAssetsManager.getGenshinCacheData("AvatarPromoteExcelConfigData").find(p => p.getAsNumber("avatarPromoteId") === this.id && (p.has("promoteLevel") ? p.getAsNumber("promoteLevel") : 0) === ascension);
        if (!json) throw new AssetsNotFoundError("CharacterAscension", `${this.id}-${ascension}`);
        this._data = json.getAsJsonObject();

        this.unlockMaxLevel = json.getAsNumber("unlockMaxLevel");

        this.requiredPlayerLevel = json.getAsNumber("requiredPlayerLevel");

        this.cost = new UpgradeCost(json.has("scoinCost") ? json.getAsNumber("scoinCost") : 0, json.has("costItems") ? json.get("costItems").map(p => p.getAsJsonObject()) : [], enka);

        this.addProps = json.get("addProps").filter(p => p.has("propType") && p.has("value")).map(p => new StatusProperty(p.getAsString("propType") as FightProp, p.getAsNumber("value"), enka));
    }
}

export default CharacterAscension;