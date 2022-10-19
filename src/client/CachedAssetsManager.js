const EnkaClient = require("./EnkaClient");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const ConfigFile = require("../utils/ConfigFile");

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

        /** @type {number | null} */
        this._cacheUpdater = null;

        /** @type {ConfigFile | null} */
        this._githubCache = null;
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
        if (!fs.existsSync(path.resolve(this.cacheDirectoryPath, "github"))) {
            fs.mkdirSync(path.resolve(this.cacheDirectoryPath, "github"));
        }
        this._githubCache = new ConfigFile(path.resolve(this.cacheDirectoryPath, "github", "genshin_data.json"), {
            "lastUpdate": 0,
        });
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


    /** @returns {void} */
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
     * Returns true if there were any updates, false if there were no updates.
     * @returns {Promise<boolean>}
     */
    async updateContents() {
        const now = Date.now();
        const res = await fetch(`https://api.github.com/repos/Dimbreath/GenshinData/commits?since=${new Date(this._githubCache.getValue("lastUpdate")).toISOString()}`);
        if (res.status !== 200) {
            throw new Error("Request Failed");
        }
        const data = await res.json();

        if (data.length === 0) return false;

        // TODO: update cache

        await this._githubCache.set("lastUpdate", now).save();
    }

    /** 
     * @param {boolean} [instant]
     * @param {number} [timeout]
     * @returns {void}
     */
    activateAutoCacheUpdater(instant = true, timeout = 3600) {
        if (instant) this.updateContents();
        this._cacheUpdater = setInterval(async () => {
            this.updateContents();
        }, timeout);
    }

    /** @returns {void} */
    deactivateAutoCacheUpdater() {
        if (this._cacheUpdater !== null) {
            clearInterval(this._cacheUpdater);
            this._cacheUpdater = null;
        }
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