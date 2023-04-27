import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import EnkaUser from "./EnkaUser";
import CharacterBuild from "./CharacterBuild";

/**
 * @en EnkaProfile
 */
export default class EnkaProfile {
    _data: JsonObject;
    enka: EnkaClient;
    username: string;
    bio: string;
    avatar: string | null;
    imageUrl: string | null;
    level: number;
    signupState: number;
    url: string;

    constructor(data: JsonObject, enka: EnkaClient) {

        /** @type {Object<string, any>} */
        this._data = data;

        /** @type {import("../../client/EnkaClient")} */
        this.enka = enka;

        /** @type {string} */
        this.username = data.username as string;

        const profile = data.profile as JsonObject;

        /** @type {string} */
        this.bio = profile.bio as string;

        /** @type {string | null} */
        this.avatar = profile.avatar as string | null;

        /** @type {string | null} */
        this.imageUrl = (profile.image_url ?? null) as string | null;

        /** @type {number} */
        this.level = profile.level as number;

        /** @type {number} */
        this.signupState = profile.signup_state as number;

        /** @type {string} */
        this.url = `${enka.options.enkaUrl}/u/${this.username}`;
    }

    async fetchAllEnkaUsers(): Promise<EnkaUser[]> {
        return await this.enka.fetchAllEnkaUsers(this.username);
    }

    /**
     * @param hash EnkaUser hash
     */
    async fetchEnkaUserBuilds(hash: string): Promise<{ [s: string]: CharacterBuild[] }> {
        return await this.enka.fetchEnkaUserBuilds(this.username, hash);
    }

}