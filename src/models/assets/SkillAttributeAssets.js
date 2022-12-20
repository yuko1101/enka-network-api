const TextAssets = require("./TextAssets");
const { LanguageCode } = require("../../client/CachedAssetsManager");

/** 
 * @en SkillAttributeAssets
 * @extends {TextAssets}
 */
class SkillAttributeAssets extends TextAssets {
    /** 
     * @param {number} id
     * @param {EnkaClient} enka
     * @param {Array<number>} paramList
     */
    constructor(id, enka, paramList) {
        super(id, enka);

        /** @type {Array<number>} */
        this._paramList = paramList;
    }

    /**
     * @param {LanguageCode} [lang]
     * @returns {{ name: string, valueText: string, usedNumbers: Array<number> }}
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
}

module.exports = SkillAttributeAssets;