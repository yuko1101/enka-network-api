import fs from "fs";
import path from "path";
import { Axios } from "axios";
import unzipper from "unzipper";
import { ConfigFile, JsonArray, JsonObject, isJsonObject } from "config_file.js";
import { bindOptions } from "../utils/options_utils";
import { fetchJSON } from "../utils/axios_utils";
import { move } from "../utils/file_utils";
import ObjectKeysManager from "./ObjectKeysManager";
import EnkaClient from "./EnkaClient";

const languages: LanguageCode[] = ["chs", "cht", "de", "en", "es", "fr", "id", "jp", "kr", "pt", "ru", "th", "vi"];

let dataMemory: { [key: string]: JsonObject[] } = {};

export type LanguageMap = { [key in LanguageCode]: { [key: string]: string } };

const initialLangDataMemory: LanguageMap = { chs: {}, cht: {}, de: {}, en: {}, es: {}, fr: {}, id: {}, jp: {}, kr: {}, pt: {}, ru: {}, th: {}, vi: {} };
let langDataMemory: LanguageMap = { ...initialLangDataMemory };

let objectKeysManager: ObjectKeysManager | null;

/**
 * @en LanguageCode
 */
export type LanguageCode = "chs" | "cht" | "de" | "en" | "es" | "fr" | "id" | "jp" | "kr" | "pt" | "ru" | "th" | "vi";

// Thanks @Dimbreath
const contentBaseUrl = "https://gitlab.com/Dimbreath/AnimeGameData/-/raw/master";
const contents = [
    "AvatarExcelConfigData", // Characters
    "FetterInfoExcelConfigData", // Advanced Characters Info
    "AvatarCostumeExcelConfigData", // Costumes
    "AvatarSkillDepotExcelConfigData", // Skill Depot
    "AvatarSkillExcelConfigData", // Skills
    "AvatarTalentExcelConfigData", // Constellations
    "AvatarPromoteExcelConfigData", // Character Ascensions
    "ReliquaryExcelConfigData", // Artifacts
    "ReliquarySetExcelConfigData", // Artifact Sets
    "WeaponExcelConfigData", // Weapons
    "EquipAffixExcelConfigData", // Artifact Set Bonus
    "ManualTextMapConfigData", // Fight Props
    "MaterialExcelConfigData", // Materials (including NameCards)
    "ProudSkillExcelConfigData", // Passive Talents
    "ReliquaryAffixExcelConfigData", // Artifact Affix
    "AvatarCodexExcelConfigData", // Character Release Information
    "AvatarHeroEntityExcelConfigData", // Travelers
    "TrialAvatarFetterDataConfigData", // Archons
];

const textMapWhiteList = [
    2329553598, // Aether
    3241049361, // Lumine
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
];

const getGitRemoteAPIUrl = (useRawGenshinData: boolean, rawDate: Date, date: Date) => useRawGenshinData
    ? `https://gitlab.com/api/v4/projects/41287973/repository/commits?since=${rawDate.toISOString()}`
    : `https://api.github.com/repos/yuko1101/enka-network-api/commits?sha=main&path=cache.zip&since=${date.toISOString()}`;

/**
 * @en CachedAssetsManager
 */
class CachedAssetsManager {
    readonly enka: EnkaClient;
    readonly defaultCacheDirectoryPath: string;
    readonly _contentsSrc: string[];
    readonly _langs: string[];
    cacheDirectoryPath: string;
    _cacheUpdater: NodeJS.Timer | null;
    _githubCache: ConfigFile | null;
    _isFetching: boolean;

    constructor(enka: EnkaClient) {
        this.enka = enka;
        this.defaultCacheDirectoryPath = path.resolve(__dirname, "..", "..", "cache");
        this._contentsSrc = contents;
        this._langs = languages;

        this.cacheDirectoryPath = enka.options.cacheDirectory ?? this.defaultCacheDirectoryPath;
        this._cacheUpdater = null;
        this._githubCache = null;
        this._isFetching = false;
    }

    async cacheDirectorySetup(): Promise<void> {
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

    async fetchLanguageData(lang: LanguageCode, store = true) {
        await this.cacheDirectorySetup();
        const url = `${contentBaseUrl}/TextMap/TextMap${lang.toUpperCase()}.json`;
        const json = (await fetchJSON(url, this.enka)).data;
        if (store) fs.writeFileSync(path.resolve(this.cacheDirectoryPath, "langs", `${lang}.json`), JSON.stringify(json));
        return json;
    }

    /**
     * Whether the game data update is available or not.
     * @param useRawGenshinData Whether to fetch from gitlab repo ({@link https://gitlab.com/Dimbreath/AnimeGameData}) instead of downloading cache.zip
     */
    async checkForUpdates(useRawGenshinData = false): Promise<boolean> {
        await this.cacheDirectorySetup();
        const url = getGitRemoteAPIUrl(useRawGenshinData, new Date(this._githubCache?.getValue("rawLastUpdate") as (number | null | undefined) ?? 0), new Date(this._githubCache?.getValue("lastUpdate") as (number | null | undefined) ?? 0));

        const res = await fetchJSON(url, this.enka);
        if (res.status !== 200) {
            throw new Error("Request Failed");
        }

        const data = res.data;

        return data.length !== 0;
    }

    /**
     * @param options.useRawGenshinData Whether to fetch from gitlab repo ({@link https://gitlab.com/Dimbreath/AnimeGameData}) instead of downloading cache.zip
     * @param options.ghproxy Whether to use ghproxy.com
     */
    async fetchAllContents(options: { useRawGenshinData?: boolean, ghproxy?: boolean }): Promise<void> {
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
            await this._githubCache?.set("lastUpdate", Date.now()).save();
            if (this.enka.options.showFetchCacheLog) {
                console.info("Download completed");
            }
        } else {
            if (this.enka.options.showFetchCacheLog) {
                console.info("Downloading structure data files...");
            }

            const promises = [];
            const genshinData: { [s: string]: JsonArray } = {};
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

            const langsData: LanguageMap = { ...initialLangDataMemory };
            const langPromises = [];
            for (const lang of languages) {
                langPromises.push(
                    (async () => {
                        const data = await this.fetchLanguageData(lang, false);
                        if (this.enka.options.showFetchCacheLog) {
                            console.info(`Downloaded langs/${lang}.json`);
                        }
                        langsData[lang] = data;
                    })(),
                );
            }
            await Promise.all(langPromises);

            if (this.enka.options.showFetchCacheLog) {
                console.info("> Downloaded all language files");
                console.info("Parsing data... (This may take more than 10 minutes)");
            }

            const clearLangsData: LanguageMap = this.removeUnusedTextData(genshinData, langsData);

            if (this.enka.options.showFetchCacheLog) {
                console.info("> Parsing completed");
                console.info("Saving into files...");
            }

            for (const lang of Object.keys(clearLangsData) as LanguageCode[]) {
                fs.writeFileSync(path.resolve(this.cacheDirectoryPath, "langs", `${lang}.json`), JSON.stringify(clearLangsData[lang]));
            }

            for (const key in genshinData) {
                fs.writeFileSync(path.resolve(this.cacheDirectoryPath, "data", `${key}.json`), JSON.stringify(genshinData[key]));
            }

            await this._githubCache?.set("rawLastUpdate", Date.now()).save();

            if (this.enka.options.showFetchCacheLog) {
                console.info(">> All Completed");
            }
        }
        this._isFetching = false;


    }

    hasAllContents(): boolean {
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
     * @param options.useRawGenshinData Whether to fetch from gitlab repo ({@link https://gitlab.com/Dimbreath/AnimeGameData}) instead of downloading cache.zip
     * @param options.ghproxy Whether to use ghproxy.com
     */
    async updateContents(options: { useRawGenshinData?: boolean, ghproxy?: boolean, onUpdateStart?: () => Promise<void>, onUpdateEnd?: () => Promise<void> } = {}): Promise<void> {
        options = bindOptions({
            useRawGenshinData: false,
            ghproxy: false,
            onUpdateStart: null,
            onUpdateEnd: null,
        }, options);

        await this.cacheDirectorySetup();

        const url = getGitRemoteAPIUrl(!!options.useRawGenshinData, new Date((this._githubCache?.getValue("rawLastUpdate") ?? 0) as number), new Date((this._githubCache?.getValue("lastUpdate") ?? 0) as number));

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
     * @param options.useRawGenshinData Whether to fetch from gitlab repo ({@link https://gitlab.com/Dimbreath/AnimeGameData}) instead of downloading cache.zip
     * @param options.ghproxy Whether to use ghproxy.com
     * @param options.timeout in milliseconds
     */
    activateAutoCacheUpdater(options: { useRawGenshinData?: boolean, instant?: boolean, ghproxy?: boolean, timeout?: number, onUpdateStart?: () => Promise<void>, onUpdateEnd?: () => Promise<void>, onError?: (error: Error) => Promise<void> } = {}): void {
        options = bindOptions({
            useRawGenshinData: false,
            instant: true,
            ghproxy: false,
            timeout: 60 * 60 * 1000,
            onUpdateStart: null,
            onUpdateEnd: null,
            onError: null,
        }, options);
        if (options.timeout as number < 60 * 1000) throw new Error("timeout cannot be shorter than 1 minute.");
        if (options.instant) this.updateContents({ onUpdateStart: options.onUpdateStart, onUpdateEnd: options.onUpdateEnd, useRawGenshinData: options.useRawGenshinData, ghproxy: options.ghproxy });
        this._cacheUpdater = setInterval(async () => {
            if (this._isFetching) return;
            try {
                this.updateContents({ onUpdateStart: options.onUpdateStart, onUpdateEnd: options.onUpdateEnd, useRawGenshinData: options.useRawGenshinData, ghproxy: options.ghproxy });
            } catch (e) {
                if (e instanceof Error) options.onError?.(e);
            }
        }, options.timeout);
    }

    deactivateAutoCacheUpdater(): void {
        if (this._cacheUpdater !== null) {
            clearInterval(this._cacheUpdater);
            this._cacheUpdater = null;
        }
    }

    getLanguageDataPath(lang: LanguageCode): string {
        return path.resolve(this.cacheDirectoryPath, "langs", `${lang}.json`);
    }

    /**
     * @param name without extensions (.json)
     */
    getJSONDataPath(name: string): string {
        return path.resolve(this.cacheDirectoryPath, "data", `${name}.json`);
    }

    /**
     * @param name without extensions (.json)
     */
    getGenshinCacheData(name: string): JsonObject[] {
        if (!Object.keys(dataMemory).includes(name)) {
            dataMemory[name] = JSON.parse(fs.readFileSync(this.getJSONDataPath(name), "utf-8"));
        }
        return dataMemory[name];
    }

    getLanguageData(lang: LanguageCode): { [key: string]: string } {
        if (Object.keys(langDataMemory[lang]).length === 0) {
            langDataMemory[lang] = JSON.parse(fs.readFileSync(this.getLanguageDataPath(lang), "utf-8"));
        }
        return langDataMemory[lang];
    }

    getObjectKeysManager(): ObjectKeysManager {
        if (!objectKeysManager) objectKeysManager = new ObjectKeysManager(this);
        return objectKeysManager;
    }

    /**
     * Clean memory of cache data.
     * Then reload data that was loaded before the clean if `reload` is true.
     * If `reload` is false, load each file as needed.
     */
    refreshAllData(reload = false): void {
        const loadedData = reload ? Object.keys(dataMemory) : null;
        const loadedLangs = reload ? Object.keys(langDataMemory) as LanguageCode[] : null;

        dataMemory = {};
        langDataMemory = { ...initialLangDataMemory };

        objectKeysManager = null;

        if (reload && loadedData && loadedLangs) {
            for (const name of loadedData) {
                this.getGenshinCacheData(name);
            }
            for (const lang of loadedLangs) {
                this.getLanguageData(lang);
            }
            objectKeysManager = new ObjectKeysManager(this);
        }
    }


    /**
     * Remove all unused TextHashMaps
     * @param data {AvatarExcelConfigData: [Object object], ManualTextMapConfigData: [Object object], ...}
     * @param langsData {en: [Object object], jp: [Object object], ...}
     */
    removeUnusedTextData(data: { [s: string]: JsonArray }, langsData: LanguageMap, showLog = true): LanguageMap {
        const required: number[] = [];

        required.push(...textMapWhiteList);

        data["AvatarExcelConfigData"].forEach(c => {
            if (!isJsonObject(c)) return;
            required.push(c.nameTextMapHash as number, c.descTextMapHash as number);
        });
        data["FetterInfoExcelConfigData"].forEach(c => {
            if (!isJsonObject(c)) return;
            required.push(
                c.avatarNativeTextMapHash as number,
                c.avatarVisionBeforTextMapHash as number,
                c.avatarConstellationAfterTextMapHash as number,
                c.avatarConstellationBeforTextMapHash as number,
                c.avatarTitleTextMapHash as number,
                c.avatarDetailTextMapHash as number,
                c.cvChineseTextMapHash as number,
                c.cvJapaneseTextMapHash as number,
                c.cvEnglishTextMapHash as number,
                c.cvKoreanTextMapHash as number,
            );
        });
        data["ManualTextMapConfigData"].forEach(m => {
            if (!isJsonObject(m)) return;
            const id = m.textMapId as string;
            if (!manualTextMapWhiteList.includes(id) && !id.startsWith("FIGHT_REACTION_") && !id.startsWith("FIGHT_PROP_") && !id.startsWith("PROP_") && !id.startsWith("WEAPON_")) return;
            required.push(m.textMapContentTextMapHash as number);
        });
        data["ReliquaryExcelConfigData"].forEach(a => {
            if (!isJsonObject(a)) return;
            required.push(a.nameTextMapHash as number, a.descTextMapHash as number);
        });
        data["EquipAffixExcelConfigData"].forEach(s => {
            if (!isJsonObject(s)) return;
            required.push(s.nameTextMapHash as number, s.descTextMapHash as number);
        });
        data["AvatarTalentExcelConfigData"].forEach(c => {
            if (!isJsonObject(c)) return;
            required.push(c.nameTextMapHash as number, c.descTextMapHash as number);
        });
        data["AvatarCostumeExcelConfigData"].forEach(c => {
            if (!isJsonObject(c)) return;
            required.push(c.nameTextMapHash as number, c.descTextMapHash as number);
        });
        data["ProudSkillExcelConfigData"].forEach(p => {
            if (!isJsonObject(p)) return;
            required.push(p.nameTextMapHash as number, p.descTextMapHash as number, ...(p.paramDescList ?? []) as number[]);
        });
        data["AvatarSkillExcelConfigData"].forEach(s => {
            if (!isJsonObject(s)) return;
            required.push(s.nameTextMapHash as number, s.descTextMapHash as number);
        });
        data["WeaponExcelConfigData"].forEach(w => {
            if (!isJsonObject(w)) return;
            required.push(w.nameTextMapHash as number, w.descTextMapHash as number);
        });
        data["EquipAffixExcelConfigData"].forEach(r => {
            if (!isJsonObject(r)) return;
            required.push(r.nameTextMapHash as number, r.descTextMapHash as number);
        });
        data["MaterialExcelConfigData"].forEach(m => {
            if (!isJsonObject(m)) return;
            required.push(m.nameTextMapHash as number, m.descTextMapHash as number);
        });

        const requiredStringKeys = required.filter(key => key).map(key => key.toString());

        if (showLog) console.info(`Required keys have been loaded (${requiredStringKeys.length.toLocaleString()} keys)`);

        const clearLangsData: LanguageMap = { ...initialLangDataMemory };

        for (const lang of Object.keys(langsData) as LanguageCode[]) {
            if (showLog) console.info(`Modifying language "${lang}"...`);
            clearLangsData[lang] = {};
            for (const key in langsData[lang]) {
                if (requiredStringKeys.includes(key)) {
                    clearLangsData[lang][key] = langsData[lang][key];
                }
            }
            // console.log(Object.keys(langData).length + " keys in " + lang);
            // console.log(Object.keys(clearLangsData).length + " langs");
        }

        if (showLog) console.info("Removing unused keys completed.");

        return clearLangsData;
    }

    /**
     * @param options.ghproxy Whether to use ghproxy.com
     */
    async _downloadCacheZip(options: { ghproxy?: boolean } = {}): Promise<void> {
        options = bindOptions({
            ghproxy: false,
        }, options);

        const axios = new Axios({});

        const url = (options.ghproxy ? "https://ghproxy.com/" : "") + "https://raw.githubusercontent.com/yuko1101/enka-network-api/main/cache.zip";

        const res = await axios.get(url, {
            responseType: "stream",
        }).catch(e => {
            throw new Error(`Failed to download genshin data from ${url} with an error: ${e}`);
        });
        if (res.status == 200) {
            await new Promise<void>(resolve => {
                const cacheParentDirectory = path.resolve(this.cacheDirectoryPath, "..");
                const zipPath = path.resolve(this.defaultCacheDirectoryPath, "..", "cache-downloaded.zip");
                res.data.pipe(fs.createWriteStream(zipPath));
                res.data.on("end", () => {
                    fs.createReadStream(zipPath)
                        .pipe(unzipper.Extract({ path: cacheParentDirectory }))
                        .on("close", () => {
                            fs.rmSync(zipPath);
                            resolve();
                        });
                });
            });

        } else {
            throw new Error(`Failed to download genshin data from ${url} with status ${res.status} - ${res.statusText}`);
        }
    }
}

export default CachedAssetsManager;