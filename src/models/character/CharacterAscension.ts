import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import UpgradeCost from "../material/UpgradeCost";
import StatusProperty, { FightProp } from "../StatusProperty";

/**
 * @en CharacterAscension
 */
class CharacterAscension {
    readonly id: number;
    readonly ascension: number;
    readonly enka: EnkaClient;
    readonly _data: JsonObject;
    readonly unlockMaxLevel: number;
    readonly requiredPlayerLevel: number;
    readonly cost: UpgradeCost;
    readonly addProps: StatusProperty[];

    /**
     * @param id avatarPromoteId
     * @param ascension promoteLevel
     * @param data If `data` provided, use `data` instead of searching with `id`.
     */
    constructor(id: number, ascension: number, enka: EnkaClient, data?: JsonObject) {
        this.id = id;

        this.ascension = ascension;

        this.enka = enka;

        const _data: JsonObject | undefined = data ?? enka.cachedAssetsManager.getGenshinCacheData("AvatarPromoteExcelConfigData").find(a => a.avatarPromoteId === id && (a.promoteLevel ?? 0) === ascension);
        if (!_data) throw new AssetsNotFoundError("CharacterAscension", `${id}-${ascension}`);
        this._data = _data;

        this.unlockMaxLevel = this._data.unlockMaxLevel as number;

        this.requiredPlayerLevel = this._data.requiredPlayerLevel as number;

        this.cost = new UpgradeCost((this._data.scoinCost ?? 0) as number, (this._data.costItems ?? []) as JsonObject[], enka);

        this.addProps = (this._data.addProps as JsonObject[]).filter(p => Object.keys(p).includes("propType") && Object.keys(p).includes("value")).map(p => new StatusProperty(p.propType as FightProp, p.value as number, enka));
    }
}

export default CharacterAscension;