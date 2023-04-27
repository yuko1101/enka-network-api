import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import AssetsNotFoundError from "../../errors/AssetsNotFoundError";
import ImageAssets from "../assets/ImageAssets";
import TextAssets from "../assets/TextAssets";
import { getNameIdByCharacterId } from "../../utils/character_utils";
import { LanguageCode } from "../../client/CachedAssetsManager";

export type Birthday = {
    month: number,
    day: number,
};

export type VoiceLanguage = "chinese" | "japanese" | "english" | "korean";

export type CharacterVoices = { [lang in VoiceLanguage]: TextAssets };

/**
 * @en CharacterDetails
 */
export default class CharacterDetails {
    readonly enka: EnkaClient;
    readonly _data: JsonObject;
    readonly _nameId: string;
    readonly id: number;
    readonly birthday: Birthday | null;
    readonly location: TextAssets;
    readonly vision: TextAssets;
    readonly constellation: TextAssets;
    readonly constellationIcon: ImageAssets;
    readonly title: TextAssets;
    readonly description: TextAssets;
    readonly cv: CharacterVoices;

    constructor(id: number | null, enka: EnkaClient, characterId?: number, isArchon = false) {
        if (!id && !characterId) throw new Error("An id or character id must be provided.");

        this.enka = enka;

        const _data: JsonObject | undefined = enka.cachedAssetsManager.getGenshinCacheData("FetterInfoExcelConfigData").find(f => (id && f.fetterId === id) || f.avatarId === characterId);
        if (!_data) throw new AssetsNotFoundError("FetterInfo", `${characterId}-${id}`);
        this._data = _data;

        this._nameId = getNameIdByCharacterId(this._data.avatarId as number, enka);

        this.id = id ?? this._data.fetterId as number;

        /**
         * If the character is Traveler, this will be null.
         */
        this.birthday = (this._data.infoBirthMonth && this._data.infoBirthDay) ? { month: this._data.infoBirthMonth as number, day: this._data.infoBirthDay as number } : null;

        this.location = new TextAssets(this._data.avatarNativeTextMapHash as number, enka);

        this.vision = new TextAssets(this._data.avatarVisionBeforTextMapHash as number, enka);

        this.constellation = new TextAssets((isArchon ? this._data.avatarConstellationAfterTextMapHash : this._data.avatarConstellationBeforTextMapHash) as number, enka);

        this.constellationIcon = new ImageAssets(`Eff_UI_Talent_${this._nameId}`, enka);

        this.title = new TextAssets(this._data.avatarTitleTextMapHash as number, enka);

        this.description = new TextAssets(this._data.avatarDetailTextMapHash as number, enka);

        this.cv = {
            chinese: new TextAssets(this._data.cvChineseTextMapHash as number, enka),
            japanese: new TextAssets(this._data.cvJapaneseTextMapHash as number, enka),
            english: new TextAssets(this._data.cvEnglishTextMapHash as number, enka),
            korean: new TextAssets(this._data.cvKoreanTextMapHash as number, enka),
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
}