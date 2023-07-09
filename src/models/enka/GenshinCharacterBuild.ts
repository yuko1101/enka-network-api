import { JsonReader, JsonObject } from "config_file.js";
import Character from "../character/Character";
import EnkaClient from "../../client/EnkaClient";

/**
 * A present character build or a saved character build in Enka.Network account
 * @en GenshinCharacterBuild
 */
class GenshinCharacterBuild {
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly enkaUserInfo: { username: string, hash: string };

    /**  */
    readonly id: number;
    /**  */
    readonly name: string;
    /**  */
    readonly order: number;
    /**  */
    readonly isLive: boolean;
    /**  */
    readonly isPublic: boolean;
    /**  */
    readonly character: Character;
    /**  */
    readonly url: string;

    readonly _data: JsonObject;

    /**
     * @param data
     * @param enka
     * @param username
     * @param hash
     */
    constructor(data: JsonObject, enka: EnkaClient, username: string, hash: string) {

        this._data = data;

        this.enka = enka;

        this.enkaUserInfo = { username: username, hash: hash };

        const json = new JsonReader(this._data);

        this.id = json.getAsNumber("id");

        this.name = json.getAsString("name");

        this.order = json.getAsNumber("order");

        this.isLive = json.getAsBoolean("live");

        this.isPublic = json.getAsBoolean("public");

        this.character = new Character(json.getAsJsonObject("avatar_data"), enka);

        this.url = `${this.enka.options.enkaUrl}/u/${this.enkaUserInfo.username}/${this.enkaUserInfo.hash}/${this.character.characterData.id}/${this.id}`;
    }
}

export default GenshinCharacterBuild;