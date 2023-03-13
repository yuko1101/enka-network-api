const TextAssets = require("./TextAssets");
// eslint-disable-next-line no-unused-vars
const { LanguageCode } = require("../../client/CachedAssetsManager");

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
class SkillAttributeAssets extends TextAssets {
    /**
     * @param {number} id
     * @param {import("../../client/EnkaClient")} enka
     * @param {Array<number>} paramList
     */
    constructor(id, enka, paramList) {
        super(id, enka);

        /** @type {Array<number>} */
        this._paramList = paramList;
    }

    /**
     * @param {LanguageCode} [lang]
     * @returns {SkillAttributeData}
     */
    getAttributeData(lang) {
        const text = this.get(lang);

        const usedNumbers = [];

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
     * @param {LanguageCode} [lang]
     * @returns {SkillAttributeData | null}
     */
    getNullableAttributeData(lang) {
        try {
            return this.getAttributeData(lang);
        } catch (e) {
            return null;
        }
    }
}

module.exports = SkillAttributeAssets;