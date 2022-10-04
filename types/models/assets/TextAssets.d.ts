export = TextAssets;
declare class TextAssets {
    /**
     * @param {"artifact_sets" | "artifacts" | "characters" | "constellations" | "costumes" | "fight_props" | "namecards" | "skills" | "weapons"} category
     * @param {number | string} id
     * @param {EnkaClient} enka
     */
    constructor(category: "artifact_sets" | "artifacts" | "characters" | "constellations" | "costumes" | "fight_props" | "namecards" | "skills" | "weapons", id: number | string, enka: EnkaClient);
    /** @type {"artifact_sets" | "artifacts" | "characters" | "constellations" | "costumes" | "fight_props" | "namecards" | "skills" | "weapons"} */
    category: "artifact_sets" | "artifacts" | "characters" | "constellations" | "costumes" | "fight_props" | "namecards" | "skills" | "weapons";
    /** @type {number | string} */
    id: number | string;
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {object} */
    _data: object;
    /**
     * @param {"chs"|"cht"|"de"|"en"|"es"|"fr"|"id"|"jp"|"kr"|"pt"|"ru"|"th"|"vi"} lang
     * @returns {string}
     */
    get(lang: "chs" | "cht" | "de" | "en" | "es" | "fr" | "id" | "jp" | "kr" | "pt" | "ru" | "th" | "vi"): string;
}
import EnkaClient = require("../../client/EnkaClient");
