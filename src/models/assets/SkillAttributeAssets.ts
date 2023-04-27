import { LanguageCode } from "../../client/CachedAssetsManager";
import EnkaClient from "../../client/EnkaClient";
import TextAssets from "./TextAssets";

/**
 * @en SkillAttributeData
 */
export type SkillAttributeData = {
    name: string,
    valueText: string,
    usedNumbers: number[],
};

/**
 * @en SkillAttributeAssets
 * @extends {TextAssets}
 */
class SkillAttributeAssets extends TextAssets {
    readonly _paramList: number[];

    constructor(id: number, enka: EnkaClient, paramList: number[]) {
        super(id, enka);

        this._paramList = paramList;
    }

    getAttributeData(lang: LanguageCode): SkillAttributeData {
        const text = this.get(lang);

        const usedNumbers: number[] = [];

        const replaced = text.replace(/\{([^}]+):([^}]+)\}/g, (match, key, format) => {
            const index = Number(key.slice("param".length)) - 1;
            if (isNaN(index) || this._paramList.length <= index) return match;

            const value = this._paramList[index];
            usedNumbers.push(value);

            const isPercent = format.includes("P");

            const isInteger = format.includes("I");

            const fixMatch = format.match(/F([\d]+)/);
            const fix = fixMatch && !isInteger ? Number(fixMatch[1]) : 0;

            return (value * (isPercent ? 100 : 1)).toFixed(fix) + (isPercent ? "%" : "");
        });

        const split = replaced.split("|");

        return { name: split[0], valueText: split[1], usedNumbers };
    }

    /**
     * Returns null instead of throwing AssetsNotFoundError.
     */
    getNullableAttributeData(lang: import("../../client/CachedAssetsManager").LanguageCode): SkillAttributeData | null {
        try {
            return this.getAttributeData(lang);
        } catch (e) {
            return null;
        }
    }
}

export default SkillAttributeAssets;