import { JsonReader } from "config_file.js";
import { EnkaClient } from "../../../client/EnkaClient";
import { AssetsNotFoundError } from "../../../errors/AssetsNotFoundError";
import { ImageAssets } from "../../assets/ImageAssets";
import { TextAssets } from "../../assets/TextAssets";
import { StatProperty } from "../../StatProperty";
import { ExcelJsonObject, excelJsonOptions } from "../../../client/ExcelTransformer";

export class PassiveTalent {
    readonly id: number;
    readonly enka: EnkaClient;
    readonly name: TextAssets;
    readonly description: TextAssets;
    readonly icon: ImageAssets | null;
    readonly requiredAscension: number;
    readonly addProps: StatProperty[];
    /**
     * Whether the talent is hidden in the list of talents on the in-game character screen
     * e.g. Raiden Shogun's talent of not being able to cook (Talent ID: 522301)
     */
    readonly isHidden: boolean;

    readonly _data: ExcelJsonObject;

    constructor(data: ExcelJsonObject, enka: EnkaClient) {
        this._data = data;
        this.enka = enka;

        const json = new JsonReader(excelJsonOptions, this._data);

        this.id = json.getAsNumber("proudSkillId");

        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this.icon = json.has("icon") ? new ImageAssets(json.getAsString("icon"), enka) : null;

        this.requiredAscension = json.getAsNumberWithDefault(0, "breakLevel");

        this.addProps = StatProperty.parseAddProps(json.get("addProps"), enka);

        this.isHidden = json.getAsBooleanWithDefault(false, "isHideLifeProudSkill");
    }

    static getById(id: number, enka: EnkaClient): PassiveTalent {
        // TODO: better way to get the data
        const data = enka.cachedAssetsManager.getExcelData("ProudSkillExcelConfigData", Math.floor(id / 100), id % 100);
        if (!data) throw new AssetsNotFoundError("Talent", id);
        return new PassiveTalent(data, enka);
    }
}
