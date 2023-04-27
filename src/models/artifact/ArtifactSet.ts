import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import ImageAssets from "../assets/ImageAssets";
import TextAssets from "../assets/TextAssets";
import ArtifactSetBonus from "./ArtifactSetBonus";
import { separateByValue } from "../../utils/object_utils";
import EnkaClient from "../../client/EnkaClient";
import { JsonObject } from "config_file.js";
import Artifact from "./Artifact";
import ArtifactData from "./ArtifactData";

/**
 * @en ArtifactSet
 */
export default class ArtifactSet {
    public enka: EnkaClient;
    public id: number;
    public _data: JsonObject;
    public _setBonusData: JsonObject[];
    public setBonus: ArtifactSetBonus[];
    public icon: ImageAssets;
    public name: TextAssets;

    /**
     * @param {number} id
     * @param {import("../../client/EnkaClient")} enka
     * @param {Object<string, any>} [data]
     */
    constructor(id: number, enka: EnkaClient, data?: JsonObject) {

        this.enka = enka;

        this.id = (data?.setId ?? id) as number;

        const _data: JsonObject | undefined = data ?? enka.cachedAssetsManager.getGenshinCacheData("ReliquarySetExcelConfigData").find(s => s.setId === id);
        if (!_data) throw new AssetsNotFoundError("ArtifactSet", id);
        this._data = _data;

        /** @type {Array<Object<string, any>>} */
        this._setBonusData = enka.cachedAssetsManager.getGenshinCacheData("EquipAffixExcelConfigData").filter(bonus => bonus.id === this._data.EquipAffixId);

        if (this._setBonusData.length === 0) throw new AssetsNotFoundError("Artifact Set Bonus", `${this.id}-${this._data.EquipAffixId}`);
        if (this._setBonusData.length !== (this._data.setNeedNum as number[]).length) throw new Error(`Missing some set bonus for this artifact set (ID: ${id})`);

        /** @type {Array<ArtifactSetBonus>} */
        this.setBonus = (this._data.setNeedNum as number[]).map((n, i) => new ArtifactSetBonus(n, this._setBonusData[i], enka));

        /** @type {ImageAssets} */
        this.icon = new ImageAssets(this._data.setIcon as string, enka);

        /** @type {TextAssets} */
        this.name = new TextAssets(this._setBonusData[0].nameTextMapHash as number, enka);


    }

    /**
     * @param {Array<import("./Artifact") | import("./ArtifactData") | ArtifactSet>} artifacts
     * @returns {Array<{set: ArtifactSet, count: number, activeBonus: Array<ArtifactSetBonus>}>}
     */
    static getActiveSetBonus(artifacts: (Artifact | ArtifactData | ArtifactSet)[]): { set: ArtifactSet, count: number, activeBonus: ArtifactSetBonus[] }[] {
        const artifactSets = artifacts.map(a => (a instanceof ArtifactSet) ? a : (a instanceof ArtifactData) ? a.set : a.artifactData.set);

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