import { JsonReader } from "config_file.js";
import { EnkaClient } from "../../client/EnkaClient";
import { AssetsNotFoundError } from "../../errors/AssetsNotFoundError";
import { ImageAssets } from "../assets/ImageAssets";
import { TextAssets } from "../assets/TextAssets";
import { getNameIdByCharacterId } from "../../utils/character_utils";
import { LanguageCode } from "../../client/CachedAssetsManager";
import { ExcelJsonObject, excelJsonOptions } from "../../client/ExcelTransformer";

export interface Birthday {
    month: number;
    day: number;
}

export type VoiceLanguage = "chinese" | "japanese" | "english" | "korean";

export type CharacterVoiceActors = Record<VoiceLanguage, TextAssets>;

export class CharacterDetails {
    readonly enka: EnkaClient;
    readonly id: number;

    readonly characterId: number;
    /** If the character is Traveler, this will be null */
    readonly birthday: Birthday | null;
    readonly location: TextAssets;
    readonly vision: TextAssets;
    readonly constellation: TextAssets;
    readonly constellationIcon: ImageAssets;
    /** Travelers do not have this */
    readonly title: TextAssets;
    readonly description: TextAssets;
    readonly cv: CharacterVoiceActors;

    readonly _data: ExcelJsonObject;
    readonly _nameId: string;

    constructor(data: ExcelJsonObject, isArchon: boolean, enka: EnkaClient) {
        this.enka = enka;
        this._data = data;

        const json = new JsonReader(excelJsonOptions, this._data);

        this.id = json.getAsNumber("fetterId");
        this.characterId = json.getAsNumber("avatarId");

        this._nameId = getNameIdByCharacterId(this.characterId, enka);

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

    static getById(id: number, isArchon: boolean, enka: EnkaClient): CharacterDetails {
        const data = Object.values(enka.cachedAssetsManager.getExcelData("FetterInfoExcelConfigData")).find(f => new JsonReader(excelJsonOptions, f).getAsNumber("fetterId") === id);
        if (!data) throw new AssetsNotFoundError("FetterInfo", id);
        return new CharacterDetails(data, isArchon, enka);
    }

    static getByCharacterId(id: number, isArchon: boolean, enka: EnkaClient) {
        const data = enka.cachedAssetsManager.getExcelData("FetterInfoExcelConfigData", id);
        if (!data) throw new AssetsNotFoundError("FetterInfo by avatarId", id);
        return new CharacterDetails(data, isArchon, enka);
    }
}
