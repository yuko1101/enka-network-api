import { JsonObject } from "config_file.js";
import { renameKeys } from "../../utils/object_utils";
import EnkaClient from "../../client/EnkaClient";
import User from "../User";
import CharacterBuild from "./CharacterBuild";

export type GameServerRegion = "" | "CN" | "B" | "NA" | "EU" | "ASIA" | "TW";

/**
 * @en EnkaUser
 */
class EnkaUser {
    readonly _data: JsonObject;
    readonly enka: EnkaClient;
    readonly username: string;
    readonly hash: string;
    readonly user: User;
    readonly uid: number;
    readonly isVerified: boolean;
    readonly isPublic: boolean;
    readonly isUidPublic: boolean;
    readonly verificationCode: string;
    readonly verificationExpires: Date;
    readonly verificationCodeRetries: number;
    readonly region: GameServerRegion;
    readonly order: number;
    readonly url: string;

    /**
     * @param uid For players who do not have uid in multiplayer profile (who do not have unlocked multiplayer yet).
     */
    constructor(data: JsonObject, enka: EnkaClient, username: string, uid?: number | string) {

        this._data = data;

        this.enka = enka;

        /**
         * enka.network username, not in-game nickname
        */
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

        /**
         * https://cdn.discordapp.com/attachments/971472744820650035/1072868537472925767/image.png
         */
        this.region = data.region as GameServerRegion;

        this.order = data.order as number;

        this.url = `${enka.options.enkaUrl}/u/${username}/${this.hash}`;
    }

    async fetchBuilds(): Promise<{ [s: string]: CharacterBuild[] }> {
        return await this.enka.fetchEnkaUserBuilds(this.username, this.hash);
    }
}

export default EnkaUser;