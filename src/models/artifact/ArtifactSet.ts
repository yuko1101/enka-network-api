import { AssetsNotFoundError } from "../../errors/AssetsNotFoundError";
import { ImageAssets } from "../assets/ImageAssets";
import { TextAssets } from "../assets/TextAssets";
import { ArtifactSetBonus } from "./ArtifactSetBonus";
import { EnkaClient } from "../../client/EnkaClient";
import { JsonReader, JsonObject, separateByValue } from "config_file.js";
import { Artifact } from "./Artifact";
import { ArtifactData } from "./ArtifactData";

export class ArtifactSet {
    readonly enka: EnkaClient;
    readonly id: number;
    readonly setBonus: ArtifactSetBonus[];
    readonly icon: ImageAssets;
    readonly name: TextAssets;

    readonly _data: JsonObject;
    readonly _setBonusData: JsonObject[];

    constructor(data: JsonObject, enka: EnkaClient) {
        this.enka = enka;
        this._data = data;

        const json = new JsonReader(this._data);

        this.id = json.getAsNumber("setId");

        const setNeedNum = json.get("setNeedNum").mapArray((_, p) => p.getAsNumber());

        const setBonusJsonList = enka.cachedAssetsManager.getGenshinCacheData("EquipAffixExcelConfigData").filterArray((_, bonus) => bonus.getAsNumber("id") === json.getAsNumber("equipAffixId"));
        if (setBonusJsonList.length === 0) throw new AssetsNotFoundError("Artifact Set Bonus", `${this.id}-${json.getAsNumber("equipAffixId")}`);
        if (setBonusJsonList.length !== setNeedNum.length) throw new Error(`Missing some set bonus for this artifact set (ID: ${this.id})`);
        this._setBonusData = setBonusJsonList.map(bonus => bonus[1].getAsJsonObject());

        this.setBonus = setNeedNum.map((n, i) => new ArtifactSetBonus(n, this._setBonusData[i], enka));

        this.icon = new ImageAssets(json.getAsString("setIcon"), enka);

        this.name = new TextAssets(new JsonReader(this._setBonusData[0]).getAsNumber("nameTextMapHash"), enka);
    }

    static getById(id: number, enka: EnkaClient): ArtifactSet {
        const json = enka.cachedAssetsManager.getGenshinCacheData("ReliquarySetExcelConfigData").findArray((_, p) => p.getAsNumber("setId") === id)?.[1];
        if (!json) throw new AssetsNotFoundError("ArtifactSet", id);
        return new ArtifactSet(json.getAsJsonObject(), enka);
    }

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
