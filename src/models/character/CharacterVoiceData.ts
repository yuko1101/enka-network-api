import { JsonObject, JsonReader } from "config_file.js";
import { EnkaClient } from "../../client/EnkaClient";
import { TextAssets } from "../assets/TextAssets";
import { AssetsNotFoundError } from "../../errors/AssetsNotFoundError";
import { DynamicTextAssets } from "../assets/DynamicTextAssets";

export class CharacterVoiceData {
    readonly enka: EnkaClient;

    readonly title: TextAssets;
    readonly textContent: TextAssets;

    readonly _data: JsonObject;

    constructor(data: JsonObject, enka: EnkaClient) {
        this._data = data;
        this.enka = enka;

        const json = new JsonReader(this._data);

        this.title = new TextAssets(json.getAsNumber("voiceTitleTextMapHash"), this.enka, false, "voice_text");
        this.textContent = new DynamicTextAssets(json.getAsNumber("voiceFileTextTextMapHash"), {}, this.enka, false, "voice_text");
    }

    static getById(id: number, enka: EnkaClient): CharacterVoiceData {
        const json = enka.cachedAssetsManager.getGenshinCacheData("FettersExcelConfigData").findArray((_, voice) => voice.getAsNumber("fetterId") == id)?.[1];
        if (!json) throw new AssetsNotFoundError("CharacterVoiceData", id);
        return new CharacterVoiceData(json.getAsJsonObject(), enka);
    }
}
