const EnkaClient = require("./EnkaClient");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const languages = ["chs", "cht", "de", "en", "es", "fr", "id", "jp", "kr", "pt", "ru", "th", "vi"];


// Thanks @Dimbreath
const contentBaseUrl = "https://raw.githubusercontent.com/Dimbreath/GenshinData/master";
const contents = [
    "AvatarExcelConfigData.json", // Characters
    "AvatarCostumeExcelConfigData.json", // Costumes
    "AvatarSkillDepotExcelConfigData.json", // Skill Depot
    "AvatarSkillExcelConfigData.json", // Skills
    "AvatarTalentExcelConfigData.json", // Constellations
    "ReliquaryExcelConfigData.json", // Artifacts
    "WeaponExcelConfigData.json", // Weapons
    "EquipAffixExcelConfigData.json", // Artifact Sets
    "ManualTextMapConfigData.json", // Fight Props
    "MaterialExcelConfigData.json", // Materials (including NameCards)
    "ProudSkillExcelConfigData.json", // Passive Talents
    "ReliquaryAffixExcelConfigData.json", // Artifact Affix
    "AvatarCodexExcelConfigData.json", // Character Release Information
    "AvatarHeroEntityExcelConfigData.json", // Travelers
]

module.exports = class CachedAssetsManager {
    /**
     * @param {EnkaClient} enka 
     */
    constructor(enka) {
        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {string} */
        this.cacheDirectoryPath = path.resolve(__dirname, "..", "..", "cache");
    }

    /** @returns {void} */
    cacheDirectorySetup() {
        if (!fs.existsSync(this.cacheDirectoryPath)) {
            fs.mkdirSync(this.cacheDirectoryPath);
        }
        if (!fs.existsSync(path.resolve(this.cacheDirectoryPath, "data"))) {
            fs.mkdirSync(path.resolve(this.cacheDirectoryPath, "data"));
        }
        if (!fs.existsSync(path.resolve(this.cacheDirectoryPath, "langs"))) {
            fs.mkdirSync(path.resolve(this.cacheDirectoryPath, "langs"));
        }
    }


    /** 
     * @param {"chs"|"cht"|"de"|"en"|"es"|"fr"|"id"|"jp"|"kr"|"pt"|"ru"|"th"|"vi"} lang 
     */
    async fetchLanguageData(lang) {
        this.cacheDirectorySetup();
        const url = `${contentBaseUrl}/TextMap/TextMap${lang.toUpperCase()}.json`;
        const res = await fetch(url);
        const json = await res.json();
        fs.writeFileSync(path.resolve(this.cacheDirectoryPath, "langs", `${lang}.json`), JSON.stringify(json));
        return json;
    }

    async fetchAllContents() {
        this.cacheDirectorySetup();
        const promises = [];
        for (const lang of languages) {
            promises.push(this.fetchLanguageData(lang));
        }
        for (const content of contents) {
            const url = `${contentBaseUrl}/ExcelBinOutput/${content}`;
            const fileName = content.split("/").pop();
            promises.push((async () => {
                const res = await fetch(url);
                const json = await res.json();
                fs.writeFileSync(path.resolve(this.cacheDirectoryPath, "data", fileName), JSON.stringify(json));
                return json;
            })());
        }
        await Promise.all(promises);
    }

    /**
     * @returns {boolean}
     */
    hasAllContents() {
        for (const lang of languages) {
            if (!fs.existsSync(path.resolve(this.cacheDirectoryPath, "langs", `${lang}.json`))) return false;
        }
        for (const content of contents) {
            const fileName = content.split("/").pop();
            if (!fs.existsSync(path.resolve(this.cacheDirectoryPath, "data", fileName))) return false;
        }
        return true;
    }

    /**
     * @param {"chs"|"cht"|"de"|"en"|"es"|"fr"|"id"|"jp"|"kr"|"pt"|"ru"|"th"|"vi"} lang 
     * @returns {string}
     */
    getLanguageDataPath(lang) {
        return path.resolve(this.cacheDirectoryPath, "langs", `${lang}.json`);
    }

    /**
     * @param {string} name without extensions (.json)
     * @returns {string}
     */
    getJSONDataPath(name) {
        return path.resolve(this.cacheDirectoryPath, "data", `${name}.json`);
    }
}