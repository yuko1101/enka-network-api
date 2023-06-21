import { JsonObject, JsonReader } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import TextAssets from "../assets/TextAssets";

/**
 * @en CharacterVoiceData
 */
class CharacterVoiceData {
    /**  */
    readonly enka: EnkaClient;

    /**  */
    readonly title: TextAssets;
    /**  */
    readonly textContent: TextAssets;

    readonly _data: JsonObject;

    /**
     * @param data
     * @param enka
     */
    constructor(data: JsonObject, enka: EnkaClient) {
        this._data = data;
        this.enka = enka;

        const json = new JsonReader(this._data);

        this.title = new TextAssets(json.getAsNumber("voiceTitleTextMapHash"), this.enka);
        this.textContent = new TextAssets(json.getAsNumber("voiceFileTextTextMapHash"), this.enka);
    }
}

export default CharacterVoiceData;