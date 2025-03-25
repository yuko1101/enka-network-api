import { LanguageCode } from "../../client/CachedAssetsManager";
import { EnkaClient } from "../../client/EnkaClient";
import { DynamicTextAssets } from "./DynamicTextAssets";

export interface SkillAttributeData {
    name: string;
    valueText: string;
    usedNumbers: number[];
}

export class SkillAttributeAssets extends DynamicTextAssets {

    constructor(id: number, paramList: number[], enka: EnkaClient) {
        super(id, { paramList }, enka);
    }

    /**
     * @throws AssetsNotFoundError
     */
    getAttributeData(lang?: LanguageCode): SkillAttributeData {
        const replacedData = this.getReplacedData([], lang);
        const split = replacedData.text.split("|");

        return { name: split[0], valueText: split[1], usedNumbers: replacedData.usedParamIndices.map(i => this.dynamicData.paramList[i]) };
    }

    /**
     * @returns null instead of throwing AssetsNotFoundError.
     */
    getNullableAttributeData(lang?: LanguageCode): SkillAttributeData | null {
        try {
            return this.getAttributeData(lang);
        } catch {
            return null;
        }
    }
}

