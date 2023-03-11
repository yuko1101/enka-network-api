export = SkillAttributeAssets;
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
     * @returns {{ name: string, valueText: string, usedNumbers: Array<number> }}
     */
    getAttributeData(lang?: LanguageCode | undefined): {
        name: string;
        valueText: string;
        usedNumbers: Array<number>;
    };
}
import TextAssets = require("./TextAssets");
import { LanguageCode } from "../../client/CachedAssetsManager";
