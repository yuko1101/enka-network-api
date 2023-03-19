const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const StatusProperty = require("../StatusProperty");

/**
 * @en ArtifactSplitSubstat
 * @extends {StatusProperty}
 */
class ArtifactSplitSubstat extends StatusProperty {

    /**
     * @param {number} id
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(id, enka) {
        /** @type {Object<string, any>} */
        const data = enka.cachedAssetsManager.getGenshinCacheData("ReliquaryAffixExcelConfigData").find(a => a.id === id);
        if (!data) throw new AssetsNotFoundError("Artifact Substat", id);

        super(data.propType, data.propValue, enka);

        /** @type {Object<string, any>} */
        this._data = data;
    }
}

module.exports = ArtifactSplitSubstat;