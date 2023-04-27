import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import UpgradeCost from "../material/UpgradeCost";
import StatusProperty from "../StatusProperty";

/**
 * @en CharacterAscension
 */
export default class CharacterAscension {
    public id: number;
    public ascension: number;
    public enka: EnkaClient;
    public _data: JsonObject;
    public unlockMaxLevel: number;
    public requiredPlayerLevel: number;
    public cost: UpgradeCost;
    public addProps: StatusProperty[];

    /**
     * @param {number} id avatarPromoteId
     * @param {number} ascension promoteLevel
     * @param {import("../../client/EnkaClient")} enka
     * @param {Object<string, any>} [data] If `data` provided, use `data` instead of searching with `id`.
     */
    constructor(id: number, ascension: number, enka: EnkaClient, data?: JsonObject) {
        /** @type {number} */
        this.id = id;

        /** @type {number} */
        this.ascension = ascension;

        /** @type {import("../../client/EnkaClient")} */
        this.enka = enka;

        /** @type {Object<string, any>} */
        const _data: JsonObject | undefined = data ?? enka.cachedAssetsManager.getGenshinCacheData("AvatarPromoteExcelConfigData").find(a => a.avatarPromoteId === id && (a.promoteLevel ?? 0) === ascension);
        if (!_data) throw new AssetsNotFoundError("CharacterAscension", `${id}-${ascension}`);
        this._data = _data;

        /** @type {number} */
        this.unlockMaxLevel = this._data.unlockMaxLevel as number;

        /** @type {number} */
        this.requiredPlayerLevel = this._data.requiredPlayerLevel as number;

        /** @type {UpgradeCost} */
        this.cost = new UpgradeCost(this._data.scoinCost ?? 0, this._data.costItems ?? [], enka);

        /** @type {Array<StatusProperty>} */
        this.addProps = (this._data.addProps as JsonObject[]).filter(p => Object.keys(p).includes("propType") && Object.keys(p).includes("value")).map(p => new StatusProperty(p.propType, p.value, enka));

    }
}