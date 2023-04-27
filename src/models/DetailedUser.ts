import { JsonObject } from "config_file.js";
import EnkaClient from "../client/EnkaClient";
import Character from "./character/Character";
import User from "./User";

/**
 * @en DetailedUser
 * @extends {User}
 */
class DetailedUser extends User {
    readonly showCharacterDetails: boolean;
    readonly characters: Character[];

    /**
     * @param data
     * @param enka
     * @param uid For players who do not have uid in multiplayer profile (who do not have unlocked multiplayer yet).
     */
    constructor(data: JsonObject, enka: EnkaClient, uid?: number | string) {
        super(data, enka, uid);

        this.showCharacterDetails = !!data.avatarInfoList;

        this.characters = (data.avatarInfoList as JsonObject[] | undefined)?.map(a => new Character(a, enka)) ?? [];

    }
}

export default DetailedUser;