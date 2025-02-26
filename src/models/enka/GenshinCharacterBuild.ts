import { JsonReader, JsonObject, defaultJsonOptions } from "config_file.js";
import { Character } from "../character/Character";
import { EnkaClient } from "../../client/EnkaClient";
import { CharacterBuild, HoyoType } from "enka-system";

/**
 * A present character build or a saved character build in Enka.Network account
 */
export class GenshinCharacterBuild extends CharacterBuild {
    readonly enka: EnkaClient;
    readonly enkaUserInfo: { username: string, hash: string };

    readonly id: number;
    readonly name: string;
    readonly order: number;
    readonly isLive: boolean;
    readonly isPublic: boolean;
    readonly character: Character;
    readonly imageUrl: string | null;
    readonly hoyoType: HoyoType;
    readonly url: string;

    readonly _data: JsonObject;

    constructor(data: JsonObject, enka: EnkaClient, username: string, hash: string) {
        super();

        this._data = data;

        this.enka = enka;

        this.enkaUserInfo = { username: username, hash: hash };

        const json = new JsonReader(defaultJsonOptions, this._data);

        this.id = json.getAsNumber("id");
        this.name = json.getAsString("name");
        this.order = json.getAsNumber("order");
        this.isLive = json.getAsBoolean("live");
        this.isPublic = json.getAsBoolean("public");
        this.character = new Character(json.getAsJsonObject("avatar_data"), enka);
        this.imageUrl = json.getAsNullableString("image");
        this.hoyoType = json.getAsNumber("hoyo_type") as HoyoType;

        this.url = `${this.enka.options.enkaUrl}/u/${this.enkaUserInfo.username}/${this.enkaUserInfo.hash}/${this.character.characterData.id}/${this.id}/`;
    }
}
