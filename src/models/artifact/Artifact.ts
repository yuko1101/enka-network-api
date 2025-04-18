import { ArtifactData } from "./ArtifactData";
import { ArtifactSplitSubstat } from "./ArtifactSplitSubstat";
import { StatProperty, FightProp } from "../StatProperty";
import { JsonReader, JsonObject, defaultJsonOptions } from "config_file.js";
import { EnkaClient } from "../../client/EnkaClient";
import { IArtifact } from "../good/GOOD";
import { IGOODComponentResolvable, convertToGOODArtifactSlotKey, convertToGOODKey, convertToGOODStatKey } from "../good/IGOODResolvable";
import { excelJsonOptions } from "../../client/ExcelTransformer";

export interface SubstatsContainer {
    total: StatProperty[];
    split: ArtifactSplitSubstat[];
}

export class Artifact implements IGOODComponentResolvable<IArtifact> {
    readonly enka: EnkaClient;
    readonly artifactData: ArtifactData;
    readonly level: number;
    readonly mainstat: StatProperty;
    readonly substats: SubstatsContainer;

    /** The name of character who has this artifact for the GOOD. */
    location: string | null = null;

    readonly _data: JsonObject;

    constructor(data: JsonObject, enka: EnkaClient) {

        this.enka = enka;

        this._data = data;

        const json = new JsonReader(defaultJsonOptions, this._data);

        const reliquary = json.get("reliquary");

        this.artifactData = ArtifactData.getById(json.getAsNumber("itemId"), enka);

        this.level = reliquary.getAsNumber("level");

        // const mainstatId = reliquary.getAsNumber("mainPropId");
        // const mainstatFightProp: FightProp = enka.cachedAssetsManager.getGenshinCacheData("ReliquaryMainPropExcelConfigData").findArray((_, m) => m.getAsNumber("id") === mainstatId)?.[1].getAsString("propType") as FightProp;
        const mainstatFightProp = json.getAsString("flat", "reliquaryMainstat", "mainPropId") as FightProp;
        const levelInfo = enka.cachedAssetsManager.getExcelData("ReliquaryLevelExcelConfigData", this.artifactData.stars, this.level);
        const mainstatData = levelInfo ? new JsonReader(excelJsonOptions, levelInfo).get("addProps").findArray((_, p) => p.getAsString("propType") === mainstatFightProp)?.[1] : null;
        if (!mainstatData) throw new Error(`Failed to find the mainstat data for ${mainstatFightProp}: stars=${this.artifactData.stars}, level=${this.level}`);
        this.mainstat = new StatProperty(mainstatFightProp, mainstatData.getAsNumber("value"), enka);

        const splitSubStats = reliquary.has("appendPropIdList") ? reliquary.get("appendPropIdList")?.mapArray((_, id) => ArtifactSplitSubstat.getById(id.getAsNumber(), enka)) : [];

        this.substats = {
            total: StatProperty.sumStatProperties(splitSubStats, enka),
            split: splitSubStats,
        };

    }

    /** `lock` is always false since enka.network cannot get the lock state from the game. */
    toGOOD(): IArtifact {
        return {
            setKey: convertToGOODKey(this.artifactData.set.name.get("en")),
            slotKey: convertToGOODArtifactSlotKey(this.artifactData.equipType),
            level: this.level - 1,
            rarity: this.artifactData.stars,
            mainStatKey: convertToGOODStatKey(this.mainstat.fightProp),
            location: this.location ?? "",
            lock: false,
            substats: this.substats.total.map((substat) => ({
                key: convertToGOODStatKey(substat.fightProp),
                value: substat.isPercent ? Math.round(substat.getMultipliedValue() * 10) / 10 : Math.round(substat.getMultipliedValue()),
            })),
        };
    }
}
