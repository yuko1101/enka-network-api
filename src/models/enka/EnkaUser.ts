import { JsonObject, renameKeys } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import User from "../User";
import CharacterBuild from "./CharacterBuild";

/** @typedef */
export type GameServerRegion = "" | "CN" | "B" | "NA" | "EU" | "ASIA" | "TW";

/**
 * The game account added to the Enka.Network account.
 * @en EnkaUser
 */
class EnkaUser {
    /**  */
    readonly enka: EnkaClient;
    /** Enka.Network username, not in-game nickname */
    readonly username: string;
    /**  */
    readonly hash: string;
    /**  */
    readonly user: User;
    /**  */
    readonly uid: number;
    /**  */
    readonly isVerified: boolean;
    /**  */
    readonly isPublic: boolean;
    /**  */
    readonly isUidPublic: boolean;
    /**  */
    readonly verificationCode: string;
    /**  */
    readonly verificationExpires: Date;
    /**  */
    readonly verificationCodeRetries: number;
    /**
     * The region of the server where the account was created
     * https://cdn.discordapp.com/attachments/971472744820650035/1072868537472925767/image.png
     */
    readonly region: GameServerRegion;
    /**  */
    readonly order: number;
    /**  */
    readonly url: string;

    readonly _data: JsonObject;

    /**
     * @param data
     * @param enka
     * @param username
     * @param uid For players who do not have uid in multiplayer profile (who do not have unlocked multiplayer yet).
     */
    constructor(data: JsonObject, enka: EnkaClient, username: string, uid?: number | string) {

        this._data = data;

        this.enka = enka;

        this.username = username;

        this.hash = data.hash as string;

        const fixedData = renameKeys(data, { "player_info": "playerInfo" });
        this.user = new User(fixedData, enka, uid);

        // TODO: typescript not null check
        this.uid = uid ? Number(uid) : data.uid as number;

        this.isVerified = data.verified as boolean;

        this.isPublic = data.public as boolean;

        this.isUidPublic = data.uid_public as boolean;

        this.verificationCode = data.verification_code as string;

        this.verificationExpires = new Date(data.verification_expire as number);

        this.verificationCodeRetries = data.verification_code_retries as number;

        this.region = data.region as GameServerRegion;

        this.order = data.order as number;

        this.url = `${enka.options.enkaUrl}/u/${username}/${this.hash}`;
    }


    /**
     * @returns the character builds including saved builds in Enka.Network account
     */
    async fetchBuilds(): Promise<{ [characterId: string]: CharacterBuild[] }> {
        return await this.enka.fetchEnkaUserBuilds(this.username, this.hash);
    }
}

export default EnkaUser;