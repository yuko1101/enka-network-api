// eslint-disable-next-line no-unused-vars
const EnkaClient = require("../../client/EnkaClient");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");

/**
 * @en CharacterDetails
 */
class CharacterDetails {
    /**
     * @param {number} id
     * @param {EnkaClient} enka
     * @param {number} [characterId]
     */
    constructor(id, enka, characterId = null) {
        if (!id && !characterId) throw new Error("An id or character id must be provided.");

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {object} */
        this._data = enka.cachedAssetsManager.getGenshinCacheData("FetterInfoExcelConfigData").find(f => (id && f.fetterId === id) || f.avatarId === characterId);
        if (!this._data) throw new AssetsNotFoundError("FetterInfo", `${characterId}-${id}`);

        /** @type {number} */
        this.id = id ?? this._data.fetterId;


    }
}

module.exports = CharacterDetails;