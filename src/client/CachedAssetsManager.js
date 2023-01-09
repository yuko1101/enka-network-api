const EnkaClient = require("./EnkaClient");
const fs = require("fs");
const path = require("path");
const { Axios } = require("axios");
const unzipper = require("unzipper");
const ConfigFile = require("../utils/ConfigFile");
const { bindOptions } = require("../utils/options_utils");
const { fetchJSON } = require("../utils/axios_utils");
const { move } = require("../utils/file_utils");

const languages = ["chs", "cht", "de", "en", "es", "fr", "id", "jp", "kr", "pt", "ru", "th", "vi"];

let dataMemory = {};
let langDataMemory = {};

/** @type {ObjectKeysManager} */
let objectKeysManager;

/**
 * @en LanguageCode
 * @typedef LanguageCode
 * @type {"chs"|"cht"|"de"|"en"|"es"|"fr"|"id"|"jp"|"kr"|"pt"|"ru"|"th"|"vi"}
 */

// Thanks @Dimbreath
const contentBaseUrl = "https://gitlab.com/Dimbreath/gamedata/-/raw/main";
const contents = [
    "AvatarExcelConfigData", // Characters
    "AvatarCostumeExcelConfigData", // Costumes
    "AvatarSkillDepotExcelConfigData", // Skill Depot
    "AvatarSkillExcelConfigData", // Skills
    "AvatarTalentExcelConfigData", // Constellations
    "ReliquaryExcelConfigData", // Artifacts
    "WeaponExcelConfigData", // Weapons
    "EquipAffixExcelConfigData", // Artifact Sets
    "ManualTextMapConfigData", // Fight Props
    "MaterialExcelConfigData", // Materials (including NameCards)
    "ProudSkillExcelConfigData", // Passive Talents
    "ReliquaryAffixExcelConfigData", // Artifact Affix
    "AvatarCodexExcelConfigData", // Character Release Information
    "AvatarHeroEntityExcelConfigData", // Travelers
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

        /** @type {Array<string>} */
        this._contentsSrc = contents;

        /** @type {Array<string>} */
        this._langs = languages;

        /** @type {boolean} */
        this._isFetching = false;

        if (!objectKeysManager) objectKeysManager = new ObjectKeysManager(this);
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
                "rawLastUpdate": 0,
            }).load();
        }
    }


    /** 
     * @param {LanguageCode} lang 
     * @param {boolean} [store=true]
     */
    async fetchLanguageData(lang, store = true) {
        await this.cacheDirectorySetup();
        const url = `${contentBaseUrl}/TextMap/TextMap${lang.toUpperCase()}.json`;
        const json = (await fetchJSON(url, this.enka)).data;
        if (store) fs.writeFileSync(path.resolve(this.cacheDirectoryPath, "langs", `${lang}.json`), JSON.stringify(json));
        return json;
    }


    /** 
     * @param {object} options
     * @param {boolean} [options.useRawGenshinData=false]
     * @param {boolean} [options.ghproxy=false] Whether to use ghproxy.com
     * @returns {Promise<void>} 
     */
    async fetchAllContents(options) {
        options = bindOptions({
            useRawGenshinData: false,
        }, options);

        await this.cacheDirectorySetup();

        this._isFetching = true;

        if (!options.useRawGenshinData) {
            if (this.enka.options.showFetchCacheLog) {
                console.info("Downloading cache.zip...");
            }
            await this._downloadCacheZip();
            await this._githubCache.set("lastUpdate", Date.now()).save();
            if (this.enka.options.showFetchCacheLog) {
                console.info("Download completed");
            }
        } else {
            if (this.enka.options.showFetchCacheLog) {
                console.info("Downloading structure data files...");
            }

            const promises = [];
            const genshinData = {};
            for (const content of contents) {
                const fileName = `${content}.json`;
                const url = `${contentBaseUrl}/ExcelBinOutput/${fileName}`;
                promises.push((async () => {
                    const json = (await fetchJSON(url, this.enka)).data;
                    if (this.enka.options.showFetchCacheLog) {
                        console.info(`Downloaded data/${fileName}`);
                    }
                    genshinData[content] = json;
                })());
            }
            await Promise.all(promises);

            if (this.enka.options.showFetchCacheLog) {
                console.info("> Downloaded all structure data files");
                console.info("Downloading language files...");
            }

            const langsData = {};
            const langPromises = [];
            for (const lang of languages) {
                langPromises.push(
                    (async () => {
                        const data = await this.fetchLanguageData(lang, false);
                        if (this.enka.options.showFetchCacheLog) {
                            console.info(`Downloaded langs/${lang}.json`);
                        }
                        langsData[lang] = data;
                    })()
                );
            }
            await Promise.all(langPromises);

            if (this.enka.options.showFetchCacheLog) {
                console.info("> Downloaded all language files");
                console.info("Parsing data... (This may take more than 10 minutes)")
            }

            const clearLangsData = this.removeUnusedTextData(genshinData, langsData);

            if (this.enka.options.showFetchCacheLog) {
                console.info("> Parsing completed");
                console.info("Saving into files...");
            }

            for (const lang of Object.keys(clearLangsData)) {
                fs.writeFileSync(path.resolve(this.cacheDirectoryPath, "langs", `${lang}.json`), JSON.stringify(clearLangsData[lang]));
            }

            for (const key of Object.keys(genshinData)) {
                fs.writeFileSync(path.resolve(this.cacheDirectoryPath, "data", `${key}.json`), JSON.stringify(genshinData[key]));
            }

            await this._githubCache.set("rawLastUpdate", Date.now()).save();

            if (this.enka.options.showFetchCacheLog) {
                console.info(">> All Completed");
            }
        }
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
            const fileName = `${content}.json`;
            if (!fs.existsSync(path.resolve(this.cacheDirectoryPath, "data", fileName))) return false;
        }
        return true;
    }

    /**
     * Returns true if there were any updates, false if there were no updates.
     * @param {object} options
     * @param {boolean} [options.useRawGenshinData=false]
     * @param {boolean} [options.ghproxy=false] Whether to use ghproxy.com
     * @param {function(): Promise<*>} [options.onUpdateStart]
     * @param {function(): Promise<*>} [options.onUpdateEnd]
     * @returns {Promise<boolean>}
     */
    async updateContents(options = {}) {
        options = bindOptions({
            useRawGenshinData: false,
            ghproxy: false,
            onUpdateStart: null,
            onUpdateEnd: null,
        }, options);

        await this.cacheDirectorySetup();

        const url = options.useRawGenshinData
            ? `https://gitlab.com/api/v4/projects/41287973/repository/commits?since=${new Date(this._githubCache.getValue("rawLastUpdate") ?? 0).toISOString()}`
            : `https://api.github.com/repos/yuko1101/enka-network-api/commits?sha=main&path=cache.zip&since=${new Date(this._githubCache.getValue("lastUpdate") ?? 0).toISOString()}`;

        const res = await fetchJSON(url, this.enka);
        if (res.status !== 200) {
            throw new Error("Request Failed");
        }

        const data = res.data;

        if (data.length !== 0) {
            await options.onUpdateStart?.();
            // fetch all because large file diff cannot be retrieved
            await this.fetchAllContents({ useRawGenshinData: options.useRawGenshinData, ghproxy: options.ghproxy });
            await options.onUpdateEnd?.();
        }
    }

    /** 
     * @param {object} [options]
     * @param {boolean} [options.useRawGenshinData=false]
     * @param {boolean} [options.instant=true]
     * @param {boolean} [options.ghproxy=false] Whether to use ghproxy.com
     * @param {number} [options.timeout] in milliseconds
     * @param {function(): Promise<*>} [options.onUpdateStart]
     * @param {function(): Promise<*>} [options.onUpdateEnd]
     * @param {function(Error): Promise<*>} [options.onError]
     * @returns {void}
     */
    activateAutoCacheUpdater(options = {}) {
        options = bindOptions({
            useRawGenshinData: false,
            instant: true,
            ghproxy: false,
            timeout: 60 * 60 * 1000,
            onUpdateStart: null,
            onUpdateEnd: null,
            onError: null,
        }, options);
        if (options.timeout < 60 * 1000) throw new Error("timeout cannot be shorter than 1 minute.");
        if (options.instant) this.updateContents({ onUpdateStart: options.onUpdateStart, onUpdateEnd: options.onUpdateEnd, useRawGenshinData: options.useRawGenshinData, ghproxy: options.ghproxy });
        this._cacheUpdater = setInterval(async () => {
            if (this._isFetching) return;
            try {
                this.updateContents({ onUpdateStart: options.onUpdateStart, onUpdateEnd: options.onUpdateEnd, useRawGenshinData: options.useRawGenshinData, ghproxy: options.ghproxy });
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
     * @param {LanguageCode} lang 
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
     * @param {string} name without extensions (.json)
     * @returns {object}
     */
    getGenshinCacheData(name) {
        if (!Object.keys(dataMemory).includes(name)) {
            dataMemory[name] = JSON.parse(fs.readFileSync(this.getJSONDataPath(name), "utf-8"));
        }
        return dataMemory[name];
    }

    /**
     * @param {LanguageCode} lang
     * @return {object}
     */
    getLanguageData(lang) {
        if (!Object.keys(langDataMemory).includes(lang)) {
            langDataMemory[lang] = JSON.parse(fs.readFileSync(this.getLanguageDataPath(lang), "utf-8"));
        }
        return langDataMemory[lang];
    }

    /** @returns {ObjectKeysManager} */
    getObjectKeysManager() {
        return objectKeysManager;
    }

    /**
     * Clean memory of cache data. 
     * Then reload data that was loaded before the clean if `reload` is true.
     * If `reload` is false, load each file as needed.
     * @param {boolean} reload
     * @return {void}
     */
    refreshAllData(reload = false) {
        const loadedData = reload ? Object.keys(dataMemory) : null;
        const loadedLangs = reload ? Object.keys(langDataMemory) : null;

        dataMemory = {};
        langDataMemory = {};

        objectKeysManager = new ObjectKeysManager(this);

        if (reload) {
            for (const name of loadedData) {
                this.getGenshinCacheData(name);
            }
            for (const lang of loadedLangs) {
                this.getLanguageData(lang);
            }
        }
    }


    /**
     * Remove all unused TextHashMaps
     * @param {object} data {AvatarExcelConfigData: [Object object], ManualTextMapConfigData: [Object object], ...}
     * @param {object} langsData {en: [Object object], jp: [Object object], ...}
     */
    removeUnusedTextData(data, langsData) {
        const required = [];
        data["AvatarExcelConfigData"].forEach(c => {
            required.push(c.nameTextMapHash, c.descTextMapHash);
        });
        data["ManualTextMapConfigData"].forEach(m => {
            const id = m.textMapId;
            if (!manualTextMapWhiteList.includes(id) && !id.startsWith("FIGHT_REACTION_") && !id.startsWith("FIGHT_PROP_") && !id.startsWith("PROP_") && !id.startsWith("WEAPON_")) return;
            required.push(m.textMapContentTextMapHash);
        });
        data["ReliquaryExcelConfigData"].forEach(a => {
            required.push(a.nameTextMapHash, a.descTextMapHash)
        });
        data["EquipAffixExcelConfigData"].forEach(s => {
            required.push(s.nameTextMapHash, s.descTextMapHash);
        });
        data["AvatarTalentExcelConfigData"].forEach(c => {
            required.push(c.nameTextMapHash, c.descTextMapHash);
        });
        data["AvatarCostumeExcelConfigData"].forEach(c => {
            required.push(c.nameTextMapHash, c.descTextMapHash);
        });
        data["ProudSkillExcelConfigData"].forEach(p => {
            required.push(p.nameTextMapHash, p.descTextMapHash, ...(p.paramDescList ?? []));
        });
        data["AvatarSkillExcelConfigData"].forEach(s => {
            required.push(s.nameTextMapHash, s.descTextMapHash);
        });
        data["WeaponExcelConfigData"].forEach(w => {
            required.push(w.nameTextMapHash, w.descTextMapHash);
        });
        data["EquipAffixExcelConfigData"].forEach(r => {
            required.push(r.nameTextMapHash, r.descTextMapHash);
        });
        data["MaterialExcelConfigData"].forEach(m => {
            required.push(m.nameTextMapHash, m.descTextMapHash);
        });

        const requiredStringKeys = required.map(key => key.toString());

        const clearLangsData = {};

        for (const lang of Object.keys(langsData)) {
            const langData = { ...langsData[lang] };
            for (const key of Object.keys(langData)) {
                if (!requiredStringKeys.includes(key)) delete langData[key];
            }
            // console.log(Object.keys(langData).length + " keys in " + lang);
            clearLangsData[lang] = langData;
            // console.log(Object.keys(clearLangsData).length + " langs");
        };

        return clearLangsData;
    }

    /**
     * @param {object} options
     * @param {boolean} [options.ghproxy=false] Whether to use ghproxy.com
     * @returns {Promise<void>}
     */
    async _downloadCacheZip(options) {
        options = bindOptions({
            ghproxy: false
        }, options);

        const axios = new Axios({});

        const url = (options.ghproxy ? "https://ghproxy.com/" : "") + "https://raw.githubusercontent.com/yuko1101/enka-network-api/main/cache.zip";

        const res = await axios.get(url, {
            responseType: "stream"
        }).catch(e => {
            throw new Error(`Failed to download genshin data from ${url} with an error: ${e}`);
        });
        if (res.status == 200) {
            await new Promise(resolve => {
                res.data.pipe(fs.createWriteStream("cache.zip"));
                res.data.on("end", () => {
                    fs.createReadStream("cache.zip")
                        .pipe(unzipper.Extract({ path: "./" }))
                        .on("close", () => {
                            fs.rmSync("cache.zip");
                            resolve();
                        });
                });
            });

        } else {
            throw new Error(`Failed to download genshin data from ${url} with status ${res.status} - ${res.statusText}`);
        }
    }
}

module.exports = CachedAssetsManager;

/**
 * @en ObjectKeysManager
 */
class ObjectKeysManager {
    /** @param {CachedAssetsManager} cachedAssetsManager */
    constructor(cachedAssetsManager) {
        const costumeData = cachedAssetsManager.getGenshinCacheData("AvatarCostumeExcelConfigData");
        const jeanCostume = costumeData.find(c => c.jsonName === "Avatar_Lady_Sword_QinCostumeSea");
        const dilucCostume = costumeData.find(c => c.jsonName === "Avatar_Male_Claymore_DilucCostumeFlamme");

        this.costumeIdKey = Object.keys(jeanCostume).find(key => jeanCostume[key] === 200301);
        this.costumeCharacterIdKey = Object.keys(jeanCostume).find(key => jeanCostume[key] === 10000003);
        this.costumeStarKey = Object.keys(jeanCostume).find(key => jeanCostume[key] === 4 && dilucCostume[key] === 5);

    }
}