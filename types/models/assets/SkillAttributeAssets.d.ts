export = SkillAttributeAssets;
/**
 * @en SkillAttributeData
 * @typedef SkillAttributeData
 * @type {Object<string, any>}
 * @property {string} name
 * @property {string} valueText
 * @property {Array<number>} usedNumbers
 */
/**
 * @en SkillAttributeAssets
 * @extends {TextAssets}
 */
declare class SkillAttributeAssets extends TextAssets {
    /**
     * @param {number} id
     * @param {import("../../client/EnkaClient")} enka
     * @param {Array<number>} paramList
     */
    constructor(id: number, enka: import("../../client/EnkaClient"), paramList: Array<number>);
    /** @type {Array<number>} */
    _paramList: Array<number>;
    /**
     * @param {LanguageCode} [lang]
     * @returns {SkillAttributeData}
     */
    getAttributeData(lang?: LanguageCode | undefined): SkillAttributeData;
    /**
     * Returns null instead of throwing AssetsNotFoundError.
     * @param {LanguageCode} [lang]
     * @returns {SkillAttributeData | null}
     */
    getNullableAttributeData(lang?: LanguageCode | undefined): SkillAttributeData | null;
}
declare namespace SkillAttributeAssets {
    export { SkillAttributeData };
}
import TextAssets = require("./TextAssets");
import { LanguageCode } from "../../client/CachedAssetsManager";
type SkillAttributeData = {
    [x: string]: any;
};
