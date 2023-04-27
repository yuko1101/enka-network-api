import { JsonObject } from "config_file.js";
import { renameKeys } from "../../utils/object_utils";
import EnkaClient from "../../client/EnkaClient";
import User from "../User";
import CharacterBuild from "./CharacterBuild";

export type GameServerRegion = "" | "CN" | "B" | "NA" | "EU" | "ASIA" | "TW";

/**
 * @en EnkaUser
 */
export default class EnkaUser {
    public _data: JsonObject;
    public enka: EnkaClient;
    public username: string;
    public hash: string;
    public user: User;
    public uid: number;
    public isVerified: boolean;
    public isPublic: boolean;
    public isUidPublic: boolean;
    public verificationCode: string;
    public verificationExpires: Date;
    public verificationCodeRetries: number;
    public region: GameServerRegion;
    public order: number;
    public url: string;

    /**
     * @param uid For players who do not have uid in multiplayer profile (who do not have unlocked multiplayer yet).
     */
    constructor(data: JsonObject, enka: EnkaClient, username: string, uid?: number | string) {

        /** @type {Object<string, any>} */
        this._data = data;

        /** @type {import("../../client/EnkaClient")} */
        this.enka = enka;

        /**
         * enka.network username, not in-game nickname
         * @type {string}
        */
        this.username = username;

        /** @type {string} */
        this.hash = data.hash as string;

        const fixedData = renameKeys(data, { "player_info": "playerInfo" });
        this.user = new User(fixedData, enka, uid);

        // TODO: typescript not null check
        this.uid = uid ? Number(uid) : data.uid as number;

        /** @type {boolean} */
        this.isVerified = data.verified as boolean;

        /** @type {boolean} */
        this.isPublic = data.public as boolean;

        /** @type {boolean} */
        this.isUidPublic = data.uid_public as boolean;

        /** @type {string} */
        this.verificationCode = data.verification_code as string;

        /** @type {Date} */
        this.verificationExpires = new Date(data.verification_expire as number);

        /** @type {number} */
        this.verificationCodeRetries = data.verification_code_retries as number;

        /**
         * https://cdn.discordapp.com/attachments/971472744820650035/1072868537472925767/image.png
         */
        this.region = data.region as GameServerRegion;

        /** @type {number} */
        this.order = data.order as number;

        /** @type {string} */
        this.url = `${enka.options.enkaUrl}/u/${username}/${this.hash}`;
    }

    async fetchBuilds(): Promise<{ [s: string]: CharacterBuild[] }> {
        return await this.enka.fetchEnkaUserBuilds(this.username, this.hash);
    }
}