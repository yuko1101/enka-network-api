const EnkaClient = require("../../client/EnkaClient");
const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const StatusProperty = require("../StatusProperty");

/** 
 * @en ArtifactSplitSubstat
 * @extends {StatusProperty}
 */
class ArtifactSplitSubstat extends StatusProperty {

    /**
     * @param {number} id 
     * @param {EnkaClient} enka
     */
    constructor(id, enka) {
        /** @type {object} */
        const data = enka.cachedAssetsManager.getGenshinCacheData("ReliquaryAffixExcelConfigData").find(a => a.id === id);
        if (!data) throw new AssetsNotFoundError("Artifact Substat", id);

        super(data.propType, data.propValue, enka);

        /** @type {object} */
        this._data = data;
    }
}

module.exports = ArtifactSplitSubstat;