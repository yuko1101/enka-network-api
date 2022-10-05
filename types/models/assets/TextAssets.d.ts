export = TextAssets;
declare class TextAssets {
    /**
     * @param {number | string} id
     * @param {EnkaClient} enka
     */
    constructor(id: number | string, enka: EnkaClient);
    /** @type {number} */
    id: number;
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /**
     * @param {"chs"|"cht"|"de"|"en"|"es"|"fr"|"id"|"jp"|"kr"|"pt"|"ru"|"th"|"vi"} [lang]
     * @returns {string}
     */
    get(lang?: "chs" | "cht" | "de" | "en" | "es" | "fr" | "id" | "jp" | "kr" | "pt" | "ru" | "th" | "vi"): string;
}
import EnkaClient = require("../../client/EnkaClient");
