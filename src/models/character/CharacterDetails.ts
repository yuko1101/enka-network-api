import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import ImageAssets from "../assets/ImageAssets";
import TextAssets from "../assets/TextAssets";
import { getNameIdByCharacterId } from "../../utils/character_utils";
import { LanguageCode } from "../../client/CachedAssetsManager";

/** @typedef */
export interface Birthday {
    month: number;
    day: number;
}

/** @typedef */
export type VoiceLanguage = "chinese" | "japanese" | "english" | "korean";

/** @typedef */
export type CharacterVoices = { [lang in VoiceLanguage]: TextAssets };

/**
 * @en CharacterDetails
 */
class CharacterDetails {
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly id: number;
    /** If the character is Traveler, this will be null */
    readonly birthday: Birthday | null;
    /**  */
    readonly location: TextAssets;
    /**  */
    readonly vision: TextAssets;
    /**  */
    readonly constellation: TextAssets;
    /**  */
    readonly constellationIcon: ImageAssets;
    /** Travelers do not have this */
    readonly title: TextAssets;
    /**  */
    readonly description: TextAssets;
    /**  */
    readonly cv: CharacterVoices;

    readonly _data: JsonObject;
    readonly _nameId: string;

    /**
     * @param id
     * @param enka
     * @param characterId
     * @param isArchon
     */
    constructor(id: number | null, enka: EnkaClient, characterId?: number, isArchon = false) {
        if (!id && !characterId) throw new Error("An id or character id must be provided.");

        this.enka = enka;

        const json = enka.cachedAssetsManager.getGenshinCacheData("FetterInfoExcelConfigData").find(f => (id && f.getAsNumber("fetterId") === id) || f.getAsNumber("avatarId") === characterId);
        if (!json) throw new AssetsNotFoundError("FetterInfo", `${characterId}-${id}`);
        this._data = json.getAsJsonObject();

        this._nameId = getNameIdByCharacterId(json.getAsNumber("avatarId"), enka);

        this.id = id ?? json.getAsNumber("fetterId");

        this.birthday = (json.has("infoBirthMonth") && json.has("infoBirthDay")) ? { month: json.getAsNumber("infoBirthMonth"), day: json.getAsNumber("infoBirthDay") } : null;

        this.location = new TextAssets(json.getAsNumber("avatarNativeTextMapHash"), enka);

        this.vision = new TextAssets(json.getAsNumber("avatarVisionBeforTextMapHash"), enka);

        this.constellation = new TextAssets(isArchon ? json.getAsNumber("avatarConstellationAfterTextMapHash") : json.getAsNumber("avatarConstellationBeforTextMapHash"), enka);

        this.constellationIcon = new ImageAssets(`Eff_UI_Talent_${this._nameId}`, enka);

        this.title = new TextAssets(json.getAsNumber("avatarTitleTextMapHash"), enka);

        this.description = new TextAssets(json.getAsNumber("avatarDetailTextMapHash"), enka);

        this.cv = {
            chinese: new TextAssets(json.getAsNumber("cvChineseTextMapHash"), enka),
            japanese: new TextAssets(json.getAsNumber("cvJapaneseTextMapHash"), enka),
            english: new TextAssets(json.getAsNumber("cvEnglishTextMapHash"), enka),
            korean: new TextAssets(json.getAsNumber("cvKoreanTextMapHash"), enka),
        };
    }

    /**
     * @param lang
     */
    getCvByLanguage(lang: LanguageCode): TextAssets {
        lang ??= this.enka.options.defaultLanguage;
        switch (lang) {
            case "chs":
            case "cht":
                return this.cv.chinese;
            case "jp":
                return this.cv.japanese;
            case "kr":
                return this.cv.korean;
            default:
                return this.cv.english;
        }
    }
}

export default CharacterDetails;