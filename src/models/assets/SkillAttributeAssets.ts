import { LanguageCode } from "../../client/CachedAssetsManager";
import EnkaClient from "../../client/EnkaClient";
import DynamicTextAssets from "./DynamicTextAssets";

/**
 * @en SkillAttributeData
 * @typedef
 */
export interface SkillAttributeData {
    name: string;
    valueText: string;
    usedNumbers: number[];
}

/**
 * @en SkillAttributeAssets
 * @extends {TextAssets}
 */
class SkillAttributeAssets extends DynamicTextAssets {

    /**
     * @param id
     * @param paramList
     * @param enka
     */
    constructor(id: number, paramList: number[], enka: EnkaClient) {
        super(id, { paramList }, enka);
    }

    /**
     * @param lang
     * @throws AssetsNotFoundError
     */
    getAttributeData(lang?: LanguageCode): SkillAttributeData {
        const replacedData = this.getReplacedData([], lang);
        const split = replacedData.text.split("|");

        return { name: split[0], valueText: split[1], usedNumbers: replacedData.usedParamIndices.map(i => this.dynamicData.paramList[i]) };
    }

    /**
     * @param lang
     * @returns null instead of throwing AssetsNotFoundError.
     */
    getNullableAttributeData(lang?: LanguageCode): SkillAttributeData | null {
        try {
            return this.getAttributeData(lang);
        } catch (e) {
            return null;
        }
    }
}

export default SkillAttributeAssets;
