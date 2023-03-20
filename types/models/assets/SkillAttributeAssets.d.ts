export = SkillAttributeAssets;
/**
 * @en SkillAttributeData
 * @typedef SkillAttributeData
 * @type {object}
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
     * @param {import("../../client/CachedAssetsManager").LanguageCode} [lang]
     * @returns {SkillAttributeData}
     */
    getAttributeData(lang?: import("../../client/CachedAssetsManager").LanguageCode | undefined): SkillAttributeData;
    /**
     * Returns null instead of throwing AssetsNotFoundError.
     * @param {import("../../client/CachedAssetsManager").LanguageCode} [lang]
     * @returns {SkillAttributeData | null}
     */
    getNullableAttributeData(lang?: import("../../client/CachedAssetsManager").LanguageCode | undefined): SkillAttributeData | null;
}
declare namespace SkillAttributeAssets {
    export { SkillAttributeData };
}
import TextAssets = require("./TextAssets");
type SkillAttributeData = {
    name: string;
    valueText: string;
    usedNumbers: Array<number>;
};
