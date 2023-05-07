import { JsonReader, JsonObject } from "config_file.js";
import EnkaClient from "../client/EnkaClient";
import Character from "./character/Character";
import User from "./User";

/**
 * @en DetailedUser
 * @extends {User}
 */
class DetailedUser extends User {
    /**  */
    readonly showCharacterDetails: boolean;
    /**  */
    readonly characters: Character[];

    /**
     * @param data
     * @param enka
     */
    constructor(data: JsonObject, enka: EnkaClient) {
        super(data, enka);

        const json = new JsonReader(data);

        this.showCharacterDetails = json.has("avatarInfoList");

        this.characters = json.has("avatarInfoList") ? json.get("avatarInfoList").mapArray((_, p) => new Character(p.getAsJsonObject(), enka)) : [];

    }
}

export default DetailedUser;