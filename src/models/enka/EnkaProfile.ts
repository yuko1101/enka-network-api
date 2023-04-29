import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import EnkaUser from "./EnkaUser";
import CharacterBuild from "./CharacterBuild";

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

        this.username = data.username as string;

        const profile = data.profile as JsonObject;

        this.bio = profile.bio as string;

        this.avatar = profile.avatar as string | null;

        this.imageUrl = (profile.image_url ?? null) as string | null;

        this.level = profile.level as number;

        this.signupState = profile.signup_state as number;

        this.url = `${enka.options.enkaUrl}/u/${this.username}`;
    }

    /**
     * @returns the all game accounts added to the Enka.Network account
     */
    async fetchAllEnkaUsers(): Promise<EnkaUser[]> {
        return await this.enka.fetchAllEnkaUsers(this.username);
    }

    /**
     * @param hash EnkaUser hash
     * @returns the character builds including saved builds in Enka.Network account
     */
    async fetchEnkaUserBuilds(hash: string): Promise<{ [characterId: string]: CharacterBuild[] }> {
        return await this.enka.fetchEnkaUserBuilds(this.username, hash);
    }

}

export default EnkaProfile;