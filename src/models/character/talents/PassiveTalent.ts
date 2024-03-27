import { JsonObject, JsonReader } from "config_file.js";
import EnkaClient from "../../../client/EnkaClient";
import AssetsNotFoundError from "../../../errors/AssetsNotFoundError";
import ImageAssets from "../../assets/ImageAssets";
import TextAssets from "../../assets/TextAssets";
import StatProperty, { FightProp } from "../../StatProperty";

class PassiveTalent {
    readonly id: number;
    readonly enka: EnkaClient;
    readonly name: TextAssets;
    readonly description: TextAssets;
    readonly icon: ImageAssets;
    readonly requiredAscension: number;
    readonly addProps: StatProperty[];
    /**
     * Whether the talent is hidden in the list of talents on the in-game character screen
     * e.g. Raiden Shogun's talent of not being able to cook (Talent ID: 522301)
     */
    readonly isHidden: boolean;

    readonly _data: JsonObject;

    constructor(data: JsonObject, enka: EnkaClient) {
        this._data = data;
        this.enka = enka;

        const json = new JsonReader(this._data);

        this.id = json.getAsNumber("proudSkillId");

        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this.icon = new ImageAssets(json.getAsString("icon"), enka);

        this.requiredAscension = json.getAsNumberWithDefault(0, "breakLevel");

        this.addProps = json.get("addProps").filterArray((_, p) => p.has("propType") && p.has("value")).map(([, p]) => new StatProperty(p.getAsString("propType") as FightProp, p.getAsNumber("value"), enka));

        this.isHidden = json.getAsBooleanWithDefault(false, "isHideLifeProudSkill");
    }

    static getById(id: number, enka: EnkaClient): PassiveTalent {
        const json = enka.cachedAssetsManager.getGenshinCacheData("ProudSkillExcelConfigData").findArray((_, p) => p.getAsNumber("proudSkillId") === id)?.[1];
        if (!json) throw new AssetsNotFoundError("Talent", id);
        return new PassiveTalent(json.getAsJsonObject(), enka);
    }
}

export default PassiveTalent;