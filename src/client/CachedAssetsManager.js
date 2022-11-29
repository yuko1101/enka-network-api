const EnkaClient = require("./EnkaClient");
const fs = require("fs");
const path = require("path");
const ConfigFile = require("../utils/ConfigFile");
const { bindOptions } = require("../utils/options_utils");
const { fetchJSON } = require("../utils/axios_utils");
const { move } = require("../utils/file_utils");

const languages = ["chs", "cht", "de", "en", "es", "fr", "id", "jp", "kr", "pt", "ru", "th", "vi"];


// Thanks @Dimbreath
const contentBaseUrl = "https://gitlab.com/Dimbreath/gamedata/-/raw/main";
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
];

const manualTextMapWhiteList = [
    "EquipType",
    "EQUIP_BRACER",
    "EQUIP_DRESS",
    "EQUIP_SHOES",
    "EQUIP_RING",
    "EQUIP_NECKLACE",
    "ElementType",
    "None",
    "Fire",
    "Water",
    "Grass",
    "Electric",
    "Wind",
    "Ice",
    "Rock",
    "WeaponType",
]

/** 
 * @en CachedAssetsManager
 */
class CachedAssetsManager {

    /**
     * @param {EnkaClient} enka 
     */
    constructor(enka) {
        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {string} */
        this.defaultCacheDirectoryPath = path.resolve(__dirname, "..", "..", "cache");

        /** @type {string} */
        this.cacheDirectoryPath = enka.options.cacheDirectory ?? this.defaultCacheDirectoryPath;

        /** @type {number | null} */
        this._cacheUpdater = null;

        /** @type {ConfigFile | null} */
        this._githubCache = null;

        /** @type {boolean} */
        this._isFetching = false;
    }

    /** @returns {Promise<void>} */
    async cacheDirectorySetup() {
        if (!fs.existsSync(this.cacheDirectoryPath)) {
            fs.mkdirSync(this.cacheDirectoryPath);

            const defaultCacheFiles = fs.readdirSync(this.defaultCacheDirectoryPath);
            if (defaultCacheFiles.length > 0) {
                try {
                    move(this.defaultCacheDirectoryPath, this.cacheDirectoryPath);
                } catch (e) {
                    console.error(`Auto-Moving cache data failed with error: ${e}`);
                }
            }
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
        const json = (await fetchJSON(url, this.enka)).data;
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
                const json = (await fetchJSON(url, this.enka)).data;
                fs.writeFileSync(path.resolve(this.cacheDirectoryPath, "data", fileName), JSON.stringify(json));
                return json;
            })());
        }
        this._isFetching = true;
        await Promise.all(promises);
        await this._githubCache.set("lastUpdate", Date.now()).save();
        await this.removeUnusedTextData();
        this._isFetching = false;
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
     * @param {function(): Promise<*>} [options.onUpdateStart]
     * @param {function(): Promise<*>} [options.onUpdateEnd]
     * @returns {Promise<boolean>}
     */
    async updateContents(options = {}) {
        options = bindOptions({
            onUpdateStart: null,
            onUpdateEnd: null,
        }, options);

        await this.cacheDirectorySetup();

        const res = await fetchJSON(`https://gitlab.com/api/v4/projects/41287973/repository/commits?since=${new Date(this._githubCache.getValue("lastUpdate")).toISOString()}`, this.enka);
        if (res.status !== 200) {
            throw new Error("Request Failed");
        }

        const data = res.data;

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
     * @param {function(): Promise<*>} [options.onUpdateStart]
     * @param {function(): Promise<*>} [options.onUpdateEnd]
     * @param {function(Error): Promise<*>} [options.onError]
     * @returns {void}
     */
    activateAutoCacheUpdater(options = {}) {
        options = bindOptions({
            instant: true,
            timeout: 60 * 60 * 1000,
            onUpdateStart: null,
            onUpdateEnd: null,
            onError: null,
        }, options);
        if (options.timeout < 60 * 1000) throw new Error("timeout cannot be shorter than 1 minute.");
        if (options.instant) this.updateContents({ onUpdateStart: options.onUpdateStart, onUpdateEnd: options.onUpdateEnd });
        this._cacheUpdater = setInterval(async () => {
            if (this._isFetching) return;
            try {
                this.updateContents({ onUpdateStart: options.onUpdateStart, onUpdateEnd: options.onUpdateEnd });
            } catch (e) {
                options.onError?.(e);
            }
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


    /**
     * Remove all unused TextHashMaps
     */
    async removeUnusedTextData() {
        const required = [];
        require(this.getJSONDataPath("AvatarExcelConfigData")).forEach(c => {
            required.push(c.nameTextMapHash, c.descTextMapHash);
        });
        require(this.getJSONDataPath("ManualTextMapConfigData")).forEach(m => {
            const id = m.textMapId;
            if (!manualTextMapWhiteList.includes(id) && !id.startsWith("FIGHT_REACTION_") && !id.startsWith("FIGHT_PROP_") && !id.startsWith("PROP_") && !id.startsWith("WEAPON_")) return;
            required.push(m.textMapContentTextMapHash);
        });
        require(this.getJSONDataPath("ReliquaryExcelConfigData")).forEach(a => {
            required.push(a.nameTextMapHash, a.descTextMapHash)
        });
        require(this.getJSONDataPath("EquipAffixExcelConfigData")).forEach(s => {
            required.push(s.nameTextMapHash, s.descTextMapHash);
        });
        require(this.getJSONDataPath("AvatarTalentExcelConfigData")).forEach(c => {
            required.push(c.nameTextMapHash, c.descTextMapHash);
        });
        require(this.getJSONDataPath("AvatarCostumeExcelConfigData")).forEach(c => {
            required.push(c.nameTextMapHash, c.descTextMapHash);
        });
        require(this.getJSONDataPath("ProudSkillExcelConfigData")).forEach(p => {
            required.push(p.nameTextMapHash, p.descTextMapHash);
        });
        require(this.getJSONDataPath("AvatarSkillExcelConfigData")).forEach(s => {
            required.push(s.nameTextMapHash, s.descTextMapHash);
        });
        require(this.getJSONDataPath("WeaponExcelConfigData")).forEach(w => {
            required.push(w.nameTextMapHash, w.descTextMapHash);
        });
        require(this.getJSONDataPath("EquipAffixExcelConfigData")).forEach(r => {
            required.push(r.nameTextMapHash, r.descTextMapHash);
        });
        require(this.getJSONDataPath("MaterialExcelConfigData")).forEach(m => {
            required.push(m.nameTextMapHash, m.descTextMapHash);
        });

        const requiredStringKeys = required.map(key => key.toString());

        const langPath = path.resolve(this.cacheDirectoryPath, "langs");
        for (const file of fs.readdirSync(langPath)) {
            const data = JSON.parse(fs.readFileSync(path.resolve(langPath, file)));
            for (const key of Object.keys(data)) {
                if (!requiredStringKeys.includes(key)) delete data[key];
            }
            fs.writeFileSync(path.resolve(langPath, file), JSON.stringify(data));
        }
    }
}

module.exports = CachedAssetsManager;