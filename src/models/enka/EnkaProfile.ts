import { JsonReader, JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import EnkaUser from "./EnkaUser";
import GenshinCharacterBuild from "./GenshinCharacterBuild";

/**
 * The Enka.Network account
 * @en EnkaProfile
 */
class EnkaProfile {
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly username: string;
    /**  */
    readonly bio: string;
    /**  */
    readonly avatar: string | null;
    /**  */
    readonly imageUrl: string | null;
    /**  */
    readonly level: number;
    /**  */
    readonly signupState: number;
    /**  */
    readonly url: string;

    readonly _data: JsonObject;

    /**
     * @param data
     * @param enka
     */
    constructor(data: JsonObject, enka: EnkaClient) {

        this._data = data;

        this.enka = enka;

        const json = new JsonReader(this._data);

        this.username = json.getAsString("username");

        const profile = json.get("profile");

        this.bio = profile.getAsString("bio");

        this.avatar = profile.getAsNullableString("avatar");

        this.imageUrl = profile.getAsStringWithDefault(null, "image_url");

        this.level = profile.getAsNumber("level");

        this.signupState = profile.getAsNumber("signup_state");

        this.url = `${enka.options.enkaUrl}/u/${this.username}/`;
    }

    /**
     * @returns the all game accounts added to the Enka.Network account
     */
    async fetchAllEnkaUsers(): Promise<EnkaUser[]> {
        return await this.enka.fetchAllEnkaUsers(this.username);
    }

    /**
     * @returns the genshin accounts added to the Enka.Network account
     */
    async fetchGenshinEnkaUsers(): Promise<EnkaUser[]> {
        return await this.enka.fetchAllEnkaUsers(this.username, 0);
    }

    /**
     * @returns the starrail accounts added to the Enka.Network account
     */
    async fetchStarRailEnkaUsers(): Promise<EnkaUser[]> {
        return await this.enka.fetchAllEnkaUsers(this.username, 1);
    }

    /**
     * @param hash EnkaUser hash
     * @returns the character builds including saved builds in Enka.Network account
     */
    async fetchEnkaUserBuilds(hash: string): Promise<{ [characterId: string]: (GenshinCharacterBuild | unknown)[] }> {
        return await this.enka.fetchEnkaUserBuilds(this.username, hash);
    }


    /**
     * @param hash EnkaUser hash
     * @returns the genshin character builds including saved builds in Enka.Network account
     */
    async fetchGenshinBuilds(hash: string): Promise<{ [characterId: string]: GenshinCharacterBuild[] }> {
        return await this.enka.fetchEnkaUserGenshinBuilds(this.username, hash);
    }

    /**
     * This requires [enka](#enka) with `starrailClient`.
     * And the `starrailClient` option in [EnkaClientOptions](EnkaClientOptions) must be
     * an instance of StarRail from [starrail.js](https://github.com/yuko1101/starrail.js).
     * @param hash EnkaUser hash
     * @returns the starrail character builds including saved builds in Enka.Network account
     */
    async fetchStarRailBuilds(hash: string): Promise<{ [characterId: string]: unknown[] }> {
        return await this.enka.fetchEnkaUserStarRailBuilds(this.username, hash);
    }
}

export default EnkaProfile;