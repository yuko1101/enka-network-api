import { JsonObject, JsonReader } from "config_file.js";
import EnkaClient from "../../../client/EnkaClient";
import AssetsNotFoundError from "../../../errors/AssetsNotFoundError";
import ImageAssets from "../../assets/ImageAssets";
import TextAssets from "../../assets/TextAssets";
import DynamicTextAssets from "../../assets/DynamicTextAssets";

/**
 * Normal Attack, Elemental Skill, and Elemental Burst. Not including Passive Talents.
 * @en Skill
 */
class Skill {
    /**  */
    readonly id: number;
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly name: TextAssets;
    /**  */
    readonly description: DynamicTextAssets;
    /**  */
    readonly icon: ImageAssets;

    readonly _data: JsonObject;

    /**
     * @param data
     * @param enka
     */
    constructor(data: JsonObject, enka: EnkaClient) {
        this.enka = enka;
        this._data = data;

        const json = new JsonReader(this._data);

        this.id = json.getAsNumber("id");

        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        this.description = new DynamicTextAssets(json.getAsNumber("descTextMapHash"), {}, enka);

        this.icon = new ImageAssets(json.getAsString("skillIcon"), enka);
    }

    /**
     * @param id
     * @param enka
     */
    static getById(id: number, enka: EnkaClient): Skill {
        return new Skill(this._getJsonObjectById(id, enka), enka);
    }

    static _getJsonObjectById(id: number, enka: EnkaClient): JsonObject {
        const json = enka.cachedAssetsManager.getGenshinCacheData("AvatarSkillExcelConfigData").findArray((_, p) => p.getAsNumber("id") === id)?.[1];
        if (!json) throw new AssetsNotFoundError("Skill", id);
        return json.getAsJsonObject();
    }
}

export default Skill;