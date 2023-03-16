const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const UpgradeCost = require("../material/UpgradeCost");
const StatusProperty = require("../StatusProperty");

/**
 * @en CharacterAscension
 */
class CharacterAscension {

    /**
     * @param {number} id avatarPromoteId
     * @param {number} ascension promoteLevel
     * @param {import("../../client/EnkaClient")} enka
     * @param {Object<string, any>} [data] If `data` provided, use `data` instead of searching with `id`.
     */
    constructor(id, ascension, enka, data = null) {
        /** @type {number} */
        this.id = id;

        /** @type {number} */
        this.ascension = ascension;

        /** @type {import("../../client/EnkaClient")} */
        this.enka = enka;

        /** @type {Object<string, any>} */
        this._data = data ?? enka.cachedAssetsManager.getGenshinCacheData("AvatarPromoteExcelConfigData").find(a => a.avatarPromoteId === id && (a.promoteLevel ?? 0) === ascension);

        if (!this._data) throw new AssetsNotFoundError("CharacterAscension", `${id}-${ascension}`);

        /** @type {number} */
        this.unlockMaxLevel = this._data.unlockMaxLevel;

        /** @type {number} */
        this.requiredPlayerLevel = this._data.requiredPlayerLevel;

        /** @type {UpgradeCost} */
        this.cost = new UpgradeCost(this._data.scoinCost ?? 0, this._data.costItems ?? [], enka);

        /** @type {Array<StatusProperty>} */
        this.addProps = this._data.addProps.filter(p => Object.keys(p).includes("propType") && Object.keys(p).includes("value")).map(p => new StatusProperty(p.propType, p.value, enka));

    }
}

module.exports = CharacterAscension;