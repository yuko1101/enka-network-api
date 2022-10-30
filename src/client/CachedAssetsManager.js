const EnkaClient = require("./EnkaClient");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const ConfigFile = require("../utils/ConfigFile");
const { bindOptions } = require("../utils/options_utils");

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

/** 
 * @exports
 * @module enka-network-api
 */
class CachedAssetsManager {

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

    /** @returns {Promise<void>} */
    async cacheDirectorySetup() {
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

        const githubCachePath = path.resolve(this.cacheDirectoryPath, "github", "genshin_data.json");
        if (!fs.existsSync(githubCachePath) || !this._githubCache) {
            this._githubCache = await new ConfigFile(githubCachePath, {
                "lastUpdate": 0,
            }).load();
        }
    }


    /** 
     * @param {"chs"|"cht"|"de"|"en"|"es"|"fr"|"id"|"jp"|"kr"|"pt"|"ru"|"th"|"vi"} lang 
     */
    async fetchLanguageData(lang) {
        await this.cacheDirectorySetup();
        const url = `${contentBaseUrl}/TextMap/TextMap${lang.toUpperCase()}.json`;
        const res = await fetch(url);
        const json = await res.json();
        fs.writeFileSync(path.resolve(this.cacheDirectoryPath, "langs", `${lang}.json`), JSON.stringify(json));
        return json;
    }


    /** @returns {Promise<void>} */
    async fetchAllContents() {
        await this.cacheDirectorySetup();
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
        await this._githubCache.set("lastUpdate", Date.now()).save();
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
     * @param {object} options
     * @param {() => Promise<*>} [options.onUpdateStart]
     * @param {() => Promise<*>} [options.onUpdateEnd]
     * @returns {Promise<boolean>}
     */
    async updateContents(options = {}) {
        options = bindOptions({
            onUpdateStart: null,
            onUpdateEnd: null,
        }, options);

        await this.cacheDirectorySetup();

        const res = await fetch(`https://api.github.com/repos/Dimbreath/GenshinData/commits?since=${new Date(this._githubCache.getValue("lastUpdate")).toISOString()}`);
        if (res.status !== 200) {
            throw new Error("Request Failed");
        }

        const data = await res.json();

        if (data.length !== 0) {
            await options.onUpdateStart?.();
            // fetch all because large file diff cannot be retrieved
            await this.fetchAllContents();
            await options.onUpdateEnd?.();
        }
    }

    /** 
     * @param {object} [options]
     * @param {boolean} [options.instant]
     * @param {number} [options.timeout] in milliseconds
     * @param {() => Promise<*>} [options.onUpdateStart]
     * @param {() => Promise<*>} [options.onUpdateEnd]
     * @returns {void}
     */
    activateAutoCacheUpdater(options = {}) {
        options = bindOptions({
            instant: true,
            timeout: 60 * 60 * 1000,
            onUpdateStart: null,
            onUpdateEnd: null,
        }, options);
        if (options.timeout < 60 * 1000) throw new Error("timeout cannot be shorter than 1 minute.");
        if (options.instant) this.updateContents({ onUpdateStart: options.onUpdateStart, onUpdateEnd: options.onUpdateEnd });
        this._cacheUpdater = setInterval(async () => {
            this.updateContents({ onUpdateStart: options.onUpdateStart, onUpdateEnd: options.onUpdateEnd });
        }, options.timeout);
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

module.exports = CachedAssetsManager;