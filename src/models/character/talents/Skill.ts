import { JsonObject } from "config_file.js";
import EnkaClient from "../../../client/EnkaClient";
import AssetsNotFoundError from "../../../errors/AssetsNotFoundError";
import ImageAssets from "../../assets/ImageAssets";
import TextAssets from "../../assets/TextAssets";

/**
 * @en Skill
 * @description Normal Attack, Elemental Skill, and Elemental Burst. Not including Passive Talents.
 */
export default class Skill {
    readonly id: number;
    readonly enka: EnkaClient;
    readonly _data: JsonObject;
    readonly name: TextAssets;
    readonly description: TextAssets;
    readonly icon: ImageAssets;

    constructor(id: number, enka: EnkaClient) {

        this.id = id;

        this.enka = enka;

        const _data: JsonObject | undefined = enka.cachedAssetsManager.getGenshinCacheData("AvatarSkillExcelConfigData").find(s => s.id === id);
        if (!_data) throw new AssetsNotFoundError("Skill", id);
        this._data = _data;

        this.name = new TextAssets(this._data.nameTextMapHash as number, enka);

        this.description = new TextAssets(this._data.descTextMapHash as number, enka);

        this.icon = new ImageAssets(this._data.skillIcon as string, enka);
    }
}