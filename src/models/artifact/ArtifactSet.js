const AssetsNotFoundError = require("../../errors/AssetsNotFoundError");
const ImageAssets = require("../assets/ImageAssets");
const TextAssets = require("../assets/TextAssets");
const ArtifactSetBonus = require("./ArtifactSetBonus");
const { separateByValue } = require("../../utils/object_utils");

/**
 * @en ArtifactSet
 */
class ArtifactSet {

    /**
     * @param {number} id
     * @param {import("../../client/EnkaClient")} enka
     * @param {Object<string, any>} [data]
     */
    constructor(id, enka, data = null) {

        /** @type {import("../../client/EnkaClient")} */
        this.enka = enka;

        /** @type {number} */
        this.id = data?.setId ?? id;

        /** @type {Object<string, any>} */
        this._data = data ?? enka.cachedAssetsManager.getGenshinCacheData("ReliquarySetExcelConfigData").find(s => s.setId === id);

        if (!this._data) throw new AssetsNotFoundError("ArtifactSet", id);

        /** @type {Array<Object<string, any>>} */
        this._setBonusData = enka.cachedAssetsManager.getGenshinCacheData("EquipAffixExcelConfigData").filter(bonus => bonus.id === this._data.EquipAffixId);

        if (this._setBonusData.length === 0) throw new AssetsNotFoundError("Artifact Set Bonus", `${this.id}-${this._data.EquipAffixId}`);
        if (this._setBonusData.length !== this._data.setNeedNum.length) throw new Error(`Missing some set bonus for this artifact set (ID: ${id})`);

        /** @type {Array<ArtifactSetBonus>} */
        this.setBonus = this._data.setNeedNum.map((n, i) => new ArtifactSetBonus(n, this._setBonusData[i], enka));

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.setIcon, enka);

        /** @type {TextAssets} */
        this.name = new TextAssets(this._setBonusData[0].nameTextMapHash, enka);


    }

    /**
     * @param {Array<import("./Artifact") | import("./ArtifactData") | ArtifactSet>} artifacts
     * @returns {Array<{set: ArtifactSet, count: number, activeBonus: Array<ArtifactSetBonus>}>}
     */
    static getActiveSetBonus(artifacts) {
        const artifactSets = artifacts.map(a => (a instanceof ArtifactSet) ? a : (a instanceof require("./ArtifactData")) ? a.set : a.artifactData.set);

        const separated = separateByValue(artifactSets, a => a.id.toString());

        const artifactSetCounts = Object.values(separated).map(array => { return { count: array.length, set: array[0] }; });

        return artifactSetCounts.map(obj => {
            return {
                set: obj.set,
                count: obj.count,
                activeBonus: obj.set.setBonus.filter(bonus => bonus.needCount <= obj.count),
            };
        }).sort((a, b) => b.count - a.count);
    }
}

module.exports = ArtifactSet;