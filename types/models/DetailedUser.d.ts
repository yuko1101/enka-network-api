export = DetailedUser;
/**
 * @en DetailedUser
 * @extends {User}
 */
declare class DetailedUser extends User {
    /** @type {boolean} */
    showCharacterDetails: boolean;
    /** @type {Array<Character>} */
    characters: Array<Character>;
}
import User = require("./User");
import Character = require("./character/Character");
