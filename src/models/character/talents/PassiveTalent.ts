import { JsonObject } from "config_file.js";
import EnkaClient from "../../../client/EnkaClient";
import AssetsNotFoundError from "../../../errors/AssetsNotFoundError";
import ImageAssets from "../../assets/ImageAssets";
import TextAssets from "../../assets/TextAssets";
import StatusProperty, { FightProp } from "../../StatusProperty";

/**
 * @en PassiveTalent
 */
class PassiveTalent {
    /**  */
    readonly id: number;
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly name: TextAssets;
    /**  */
    readonly description: TextAssets;
    /**  */
    readonly icon: ImageAssets;
    /**  */
    readonly addProps: StatusProperty[];
    /**
     * Whether the talent is hidden in the list of talents on the in-game character screen
     * e.g. Raiden Shogun's talent of not being able to cook (Talent ID: 522301)
     */
    readonly isHidden: boolean;

    readonly _data: JsonObject;

    /**
     * @param id
     * @param enka
     */
    constructor(id: number, enka: EnkaClient) {
        this.id = id;

        this.enka = enka;

        const json = enka.cachedAssetsManager.getGenshinCacheData("ProudSkillExcelConfigData").findArray((_, p) => p.getAsNumber("proudSkillId") === this.id)?.[1];
        if (!json) throw new AssetsNotFoundError("Talent", this.id);
        this._data = json.getAsJsonObject();

        this.name = new TextAssets(json.getAsNumber("nameTextMapHash"), enka);

        this.description = new TextAssets(json.getAsNumber("descTextMapHash"), enka);

        this.icon = new ImageAssets(json.getAsString("icon"), enka);

        this.addProps = json.get("addProps").filterArray((_, p) => p.has("propType") && p.has("value")).map(([, p]) => new StatusProperty(p.getAsString("propType") as FightProp, p.getAsNumber("value"), enka));

        this.isHidden = json.has(enka.cachedAssetsManager.getObjectKeysManager().talentIsHiddenKey) ? json.getAsBoolean(enka.cachedAssetsManager.getObjectKeysManager().talentIsHiddenKey) : false;
    }
}

export default PassiveTalent;