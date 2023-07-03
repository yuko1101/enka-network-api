import { bindOptions } from "config_file.js";
import { LanguageCode } from "../../client/CachedAssetsManager";
import EnkaClient from "../../client/EnkaClient";
import TextAssets from "./TextAssets";
import { Gender } from "../character/CharacterData";
import { Paths } from "../../utils/ts_utils";

/** @typedef */
export type GenshinPlatform = "MOBILE" | "PC" | "PS";

/** @typedef */
export interface UserInfo {
    travelerGender?: Gender,
    travelerNickname?: string,
    platform?: GenshinPlatform,
}

/** @typedef */
export interface DynamicData {
    paramList: number[];
    userInfo: UserInfo | null;
}

/**
 * @en DynamicTextAssets
 * @extends {TextAssets}
 */
class DynamicTextAssets extends TextAssets {
    /**  */
    readonly dynamicData: DynamicData;

    /**
     * @param id
     * @param data
     * @param enka
     * @param convertToHtmlFormat
     */
    constructor(id: number, data: Partial<DynamicData>, enka: EnkaClient, convertToHtmlFormat = false) {
        super(id, enka, convertToHtmlFormat);

        this.dynamicData = bindOptions(enka.options.textAssetsDynamicData as unknown as { [s: string]: unknown }, data) as unknown as DynamicData;
    }

    /**
     * @param replaceWith an empty array is the same as an array containing all paths
     * @param lang
     * @throws AssetsNotFoundError
     */
    getReplacedData(replaceWith: Paths<DynamicData>[] = [], lang?: LanguageCode): { text: string, usedParamIndices: number[] } {
        function isEnabled(key: Paths<DynamicData>) {
            if (key.includes(".") && !isEnabled(key.split(".").slice(0, -1).join(".") as Paths<DynamicData>)) {
                return false;
            }
            return replaceWith.length === 0 || replaceWith.includes(key);
        }

        const usedParamIndices: number[] = [];

        let text = this.get(lang).replace(/^#/, "");
        if (isEnabled("paramList")) {
            text = text.replace(/\{([^}]+):([^}]+)\}/g, (match, key, format) => {
                const index = Number(key.slice("param".length)) - 1;
                if (isNaN(index) || this.dynamicData.paramList.length <= index) return match;

                const value = this.dynamicData.paramList[index];
                usedParamIndices.push(index);

                const isPercent = format.includes("P");

                const isInteger = format.includes("I");

                const fixMatch = format.match(/^F(\d+)$/);
                const fix = fixMatch && !isInteger ? Number(fixMatch[1]) : 0;

                return (value * (isPercent ? 100 : 1)).toFixed(fix) + (isPercent ? "%" : "");
            });
        }

        const placeholderMap: { [key: string]: boolean } = {};
        if (isEnabled("userInfo.travelerGender") && this.dynamicData.userInfo?.travelerGender != null) {
            placeholderMap["M"] = false;
            placeholderMap["F"] = false;
            placeholderMap[this.dynamicData.userInfo.travelerGender.slice(0, 1)] = true;
        }
        if (isEnabled("userInfo.platform") && this.dynamicData.userInfo?.platform != null) {
            placeholderMap["LAYOUT_MOBILE"] = false;
            placeholderMap["LAYOUT_PC"] = false;
            placeholderMap["LAYOUT_PS"] = false;
            placeholderMap["LAYOUT_" + this.dynamicData.userInfo.platform] = true;
        }

        // show if placeholder is true, remove if placeholder is false, and do nothing if placeholder is undefined.
        text = text.replace(/\{([^#}]+)#([^}]+)\}/g, ($0, $1, $2) => placeholderMap[$1] ? $2 : placeholderMap[$1] === false ? "" : $0);

        if (isEnabled("userInfo.travelerNickname") && this.dynamicData.userInfo?.travelerNickname != null) {
            text = text.replace(/\{NICKNAME\}/g, this.dynamicData.userInfo.travelerNickname);
        }

        return { text, usedParamIndices };
    }

    /**
     * @param replaceWith
     * @param lang
     * @returns null instead of throwing AssetsNotFoundError.
     */
    getNullableReplacedData(replaceWith: (keyof DynamicData)[] = [], lang?: LanguageCode): { text: string, usedParamIndices: number[] } | null {
        try {
            return this.getReplacedData(replaceWith, lang);
        } catch (e) {
            return null;
        }
    }

    /**
     * @param replaceWith
     * @param lang
     * @throws AssetsNotFoundError
     */
    getReplacedText(replaceWith: (keyof DynamicData)[] = [], lang?: LanguageCode): string {
        return this.getReplacedData(replaceWith, lang).text;
    }

    /**
     * @param replaceWith
     * @param lang
     * @returns null instead of throwing AssetsNotFoundError.
     */
    getNullableReplacedText(replaceWith: (keyof DynamicData)[] = [], lang?: LanguageCode): string | null {
        try {
            return this.getReplacedText(replaceWith, lang);
        } catch (e) {
            return null;
        }
    }

    /**
     * @param userInfo
     * @returns new instance of DynamicTextAssets with provided `userInfo`.
     */
    copyWithUserInfo(userInfo: UserInfo): DynamicTextAssets {
        return new DynamicTextAssets(this.id, { ...this.dynamicData, userInfo }, this.enka, this.convertToHtmlFormat);
    }
}

export default DynamicTextAssets;
