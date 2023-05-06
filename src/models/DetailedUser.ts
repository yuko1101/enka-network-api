import { JsonObject } from "config_file.js";
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

        this.showCharacterDetails = !!data.avatarInfoList;

        this.characters = (data.avatarInfoList as JsonObject[] | undefined)?.map(a => new Character(a, enka)) ?? [];

    }
}

export default DetailedUser;