import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import ImageAssets from "../assets/ImageAssets";
import TextAssets from "../assets/TextAssets";
import StatusProperty from "../StatusProperty";

/**
 * @en Constellation
 */
export default class Constellation {
    public id: number;
    public enka: EnkaClient;
    public _data: JsonObject;
    public name: TextAssets;
    public description: TextAssets;
    public icon: ImageAssets;
    public addProps: StatusProperty[];
    public paramList: number[];

    constructor(id: number, enka: EnkaClient) {

        this.id = id;

        this.enka = enka;

        const _data: JsonObject | undefined = enka.cachedAssetsManager.getGenshinCacheData("AvatarTalentExcelConfigData").find(c => c.talentId === id);
        if (!_data) throw new AssetsNotFoundError("Talent", id);
        this._data = _data;

        this.name = new TextAssets(this._data.nameTextMapHash as number, enka);

        this.description = new TextAssets(this._data.descTextMapHash as number, enka);

        this.icon = new ImageAssets(this._data.icon as string, enka);

        this.addProps = (this._data.addProps as JsonObject[]).filter(p => Object.keys(p).includes("propType") && Object.keys(p).includes("value")).map(p => new StatusProperty(p.propType, p.value, enka));

        this.paramList = this._data.paramList as number[];
    }
}