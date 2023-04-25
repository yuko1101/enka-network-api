import Character from "./character/Character";
import User from "./User";

/**
 * @en DetailedUser
 * @extends {User}
 */
export default class DetailedUser extends User {

    /**
     * @param {Object<string, any>} data
     * @param {import("../client/EnkaClient")} enka
     * @param {number | string} [uid] For players who do not have uid in multiplayer profile (who do not have unlocked multiplayer yet).
     */
    constructor(data, enka, uid = null) {
        super(data, enka, uid);

        /** @type {boolean} */
        this.showCharacterDetails = !!data.avatarInfoList;

        /** @type {Array<Character>} */
        this.characters = data.avatarInfoList?.map(a => new Character(a, enka)) ?? [];

    }
}