import { JsonObject } from "config_file.js";
import EnkaClient from "../../../client/EnkaClient";
import AssetsNotFoundError from "../../../errors/AssetsNotFoundError";
import ImageAssets from "../../assets/ImageAssets";
import TextAssets from "../../assets/TextAssets";

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
    readonly description: TextAssets;
    /**  */
    readonly icon: ImageAssets;

    readonly _data: JsonObject;

    /**
     * @param id
     * @param enka
     */
    constructor(id: number, enka: EnkaClient) {

        this.id = id;

        this.enka = enka;

        const json = enka.cachedAssetsManager.getGenshinCacheData("AvatarSkillExcelConfigData").find(p => p.getAsNumber("id") === this.id)?.detach();
        if (!json) throw new AssetsNotFoundError("Skill", this.id);
        this._data = json.getAsJsonObject();

        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this.icon = new ImageAssets(json.getAsString("skillIcon"), enka);
    }
}

export default Skill;