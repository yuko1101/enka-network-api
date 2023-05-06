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

        const _data: JsonObject | undefined = enka.cachedAssetsManager.getGenshinCacheData("AvatarSkillExcelConfigData").find(s => s.id === this.id);
        if (!_data) throw new AssetsNotFoundError("Skill", this.id);
        this._data = _data;

        this.name = new TextAssets(this._data.nameTextMapHash as number, enka);

        this.description = new TextAssets(this._data.descTextMapHash as number, enka);

        this.icon = new ImageAssets(this._data.skillIcon as string, enka);
    }
}

export default Skill;