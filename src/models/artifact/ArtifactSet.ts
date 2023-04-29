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
class ArtifactSet {
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly id: number;
    /**  */
    readonly setBonus: ArtifactSetBonus[];
    /**  */
    readonly icon: ImageAssets;
    /**  */
    readonly name: TextAssets;

    readonly _data: JsonObject;
    readonly _setBonusData: JsonObject[];

    /**
     * @param id
     * @param enka
     * @param data
     */
    constructor(id: number, enka: EnkaClient, data?: JsonObject) {

        this.enka = enka;

        this.id = (data?.setId ?? id) as number;

        const _data: JsonObject | undefined = data ?? enka.cachedAssetsManager.getGenshinCacheData("ReliquarySetExcelConfigData").find(s => s.setId === id);
        if (!_data) throw new AssetsNotFoundError("ArtifactSet", id);
        this._data = _data;

        this._setBonusData = enka.cachedAssetsManager.getGenshinCacheData("EquipAffixExcelConfigData").filter(bonus => bonus.id === this._data.EquipAffixId);

        if (this._setBonusData.length === 0) throw new AssetsNotFoundError("Artifact Set Bonus", `${this.id}-${this._data.EquipAffixId}`);
        if (this._setBonusData.length !== (this._data.setNeedNum as number[]).length) throw new Error(`Missing some set bonus for this artifact set (ID: ${id})`);

        this.setBonus = (this._data.setNeedNum as number[]).map((n, i) => new ArtifactSetBonus(n, this._setBonusData[i], enka));

        this.icon = new ImageAssets(this._data.setIcon as string, enka);

        this.name = new TextAssets(this._setBonusData[0].nameTextMapHash as number, enka);
    }

    /**
     * @param artifacts
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

export default ArtifactSet;