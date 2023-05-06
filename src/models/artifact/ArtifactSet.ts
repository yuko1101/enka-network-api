import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import ImageAssets from "../assets/ImageAssets";
import TextAssets from "../assets/TextAssets";
import ArtifactSetBonus from "./ArtifactSetBonus";
import EnkaClient from "../../client/EnkaClient";
import { JsonManager, JsonObject, separateByValue } from "config_file.js";
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
    constructor(id: number, enka: EnkaClient, data?: JsonManager) {

        this.enka = enka;

        this.id = data?.getAsNumber("setId") ?? id;

        const json = data ?? enka.cachedAssetsManager.getGenshinCacheData("ReliquarySetExcelConfigData").find(p => p.getAsNumber("setId") === this.id)?.detach();
        if (!json) throw new AssetsNotFoundError("ArtifactSet", this.id);
        this._data = json.getAsJsonObject();

        const setNeedNum = json.get("setNeedNum").map(p => p.getAsNumber());

        const setBonusJsonList = enka.cachedAssetsManager.getGenshinCacheData("EquipAffixExcelConfigData").filter(bonus => bonus.getAsNumber("id") === json.getAsNumber("EquipAffixId")).map(p => p.detach());
        if (setBonusJsonList.length === 0) throw new AssetsNotFoundError("Artifact Set Bonus", `${this.id}-${json.getAsNumber("EquipAffixId")}`);
        if (setBonusJsonList.length !== setNeedNum.length) throw new Error(`Missing some set bonus for this artifact set (ID: ${this.id})`);
        this._setBonusData = setBonusJsonList.map(bonus => bonus.getAsJsonObject());

        this.setBonus = setNeedNum.map((n, i) => new ArtifactSetBonus(n, this._setBonusData[i], enka));

        this.icon = new ImageAssets(json.getAsString("setIcon"), enka);

        this.name = new TextAssets(new JsonManager(this._setBonusData[0], true, true).getAsNumber("nameTextMapHash"), enka);
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