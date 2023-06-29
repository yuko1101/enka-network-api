import { bindOptions } from "config_file.js";
import { LanguageCode } from "../../client/CachedAssetsManager";
import EnkaClient from "../../client/EnkaClient";
import TextAssets from "./TextAssets";

/** @typedef */
export interface DynamicData {
    paramList: number[];
}

const defaultDynamicData: DynamicData = {
    paramList: [],
};

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
     */
    constructor(id: number, data: Partial<DynamicData>, enka: EnkaClient) {
        super(id, enka);

        this.dynamicData = bindOptions(defaultDynamicData as unknown as { [s: string]: unknown }, data) as unknown as DynamicData;
    }

    /**
     * @param replaceWith
     * @param lang
     * @throws AssetsNotFoundError
     */
    getReplacedData(replaceWith: (keyof DynamicData)[] = [], lang?: LanguageCode): { text: string, usedParamIndices: number[] } {
        function isEnabled(key: keyof DynamicData) {
            return replaceWith.length === 0 || replaceWith.includes(key);
        }

        const usedParamIndices: number[] = [];

        let text = this.get(lang);
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
}

export default DynamicTextAssets;
