import { JsonReader, JsonObject } from "config_file.js";
import EnkaClient from "../client/EnkaClient";
import Character from "./character/Character";
import GenshinUser from "./GenshinUser";
import { IGOOD } from "./good/GOOD";
import { IGOODComponentResolvable } from "./good/IGOODResolvable";

class DetailedGenshinUser extends GenshinUser implements IGOODComponentResolvable<IGOOD> {
    readonly showCharacterDetails: boolean;
    readonly characters: Character[];

    constructor(data: JsonObject, enka: EnkaClient) {
        super(data, enka);

        const json = new JsonReader(data);

        this.showCharacterDetails = json.has("avatarInfoList");

        this.characters = json.has("avatarInfoList") ? json.get("avatarInfoList").mapArray((_, p) => new Character(p.getAsJsonObject(), enka)) : [];

    }

    toGOOD(): IGOOD {
        return {
            format: "GOOD",
            version: 2,
            source: "yuko1101/enka-network-api",
            characters: this.characters.map(c => c.toGOOD()),
            artifacts: this.characters.flatMap(c => c.artifacts).map(a => a.toGOOD()),
            weapons: this.characters.map(c => c.weapon).map(w => w.toGOOD()),
        };
    }
}

export default DetailedGenshinUser;