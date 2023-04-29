import { JsonObject } from "config_file.js";
import Character from "../character/Character";
import EnkaClient from "../../client/EnkaClient";

/**
 * A present character build or a saved character build in Enka.Network account
 * @en CharacterBuild
 */
class CharacterBuild {
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly enkaUserInfo: { username: string, hash: string; };
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

        this.id = data.id as number;

        this.name = data.name as string;

        this.order = data.order as number;

        this.isLive = data.live as boolean;

        this.isPublic = data.public as boolean;

        this.character = new Character(data.avatar_data as JsonObject, enka);

        this.url = `${this.enka.options.enkaUrl}/u/${this.enkaUserInfo.username}/${this.enkaUserInfo.hash}/${this.character.characterData.id}/${this.id}`;
    }
}

export default CharacterBuild;