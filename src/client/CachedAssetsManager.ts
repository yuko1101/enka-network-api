import fs from "fs";
import path from "path";
import axios from "axios";
import unzip, { Entry } from "unzip-stream";
import { ConfigFile, JsonArray, JsonObject, bindOptions, move, JsonReader, JsonOptions, defaultJsonOptions } from "config_file.js";
import { fetchJSON } from "../utils/axios_utils";
import { ObjectKeysManager } from "./ObjectKeysManager";
import { EnkaClient } from "./EnkaClient";
import { validateCache } from "../utils/cache_utils";

const languages: LanguageCode[] = ["chs", "cht", "de", "en", "es", "fr", "id", "jp", "kr", "pt", "ru", "th", "vi"];

export const excelJsonOptions = {
    allowBigint: false,
} as const satisfies JsonOptions;
let dataMemory: Record<string, JsonReader<typeof excelJsonOptions>> = {};


const initialLangDataMemory: NullableLanguageMap = { chs: null, cht: null, de: null, en: null, es: null, fr: null, id: null, jp: null, kr: null, pt: null, ru: null, th: null, vi: null };
let langDataMemory: NullableLanguageMap = { ...initialLangDataMemory };

let objectKeysManager: ObjectKeysManager | null;

export type NullableLanguageMap = Record<LanguageCode, Record<string, string> | null>;
export type LanguageMap = Record<LanguageCode, Record<string, string>>;

export type LanguageCode = "chs" | "cht" | "de" | "en" | "es" | "fr" | "id" | "jp" | "kr" | "pt" | "ru" | "th" | "vi";

// Thanks @Dimbreath
const contentBaseUrl = "https://gitlab.com/Dimbreath/AnimeGameData/-/raw/master";
const contents = [
    "AvatarExcelConfigData", // Characters
    "FetterInfoExcelConfigData", // Characters Profile Info
    "AvatarCostumeExcelConfigData", // Costumes
    "AvatarSkillDepotExcelConfigData", // Skill Depot
    "AvatarSkillExcelConfigData", // Skills
    "ProudSkillExcelConfigData", // Passive Talents and Leveled Talents
    "AvatarTalentExcelConfigData", // Constellations
    "AvatarPromoteExcelConfigData", // Character Ascensions
    "AvatarCurveExcelConfigData", // Character Basic Stats Curves
    "AvatarCodexExcelConfigData", // Character Release Information

    "WeaponExcelConfigData", // Weapons
    "WeaponPromoteExcelConfigData", // Weapon Ascensions
    "WeaponCurveExcelConfigData", // Weapon Basic Stats Curves
    "WeaponCodexExcelConfigData", // Weapon Release Information
    "EquipAffixExcelConfigData", // Artifact Set Bonus and Weapon Refinements
    "ReliquaryExcelConfigData", // Artifacts
    "ReliquaryLevelExcelConfigData", // Artifact Main Affix
    "ReliquaryAffixExcelConfigData", // Artifact Sub Affix
    "ReliquarySetExcelConfigData", // Artifact Sets
    "ReliquaryCodexExcelConfigData", // Artifact valid rarities

    "ManualTextMapConfigData", // Fight Props and Other TextMaps
    "AvatarHeroEntityExcelConfigData", // Travelers
    "TrialAvatarFetterDataConfigData", // Archons

    "MaterialExcelConfigData", // Materials (including NameCards)
    "FetterCharacterCardExcelConfigData", // Friendship Rewards
    "RewardExcelConfigData", // Rewards Data for Friendship Cards

    "ProfilePictureExcelConfigData", // User pfp

    "RoleCombatDifficultyExcelConfigData", // Theater seasonal difficulty
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
    ? `https://gitlab.com/api/v4/projects/53216109/repository/commits?since=${rawDate.toISOString()}`
    : `https://api.github.com/repos/yuko1101/enka-network-api/commits?sha=main&path=cache.zip&since=${date.toISOString()}`;

export interface FetchContentsOptions {
    useRawGenshinData: boolean;
    ghproxy: boolean;
}

export interface UpdateContentsOptions extends FetchContentsOptions {
    onUpdateStart?: (() => Promise<void>) | null;
    onUpdateEnd?: (() => Promise<void>) | null;
}

export interface AutoCacheUpdaterOptions extends UpdateContentsOptions {
    instant: boolean;
    timeout: number;
    onError?: ((error: Error) => Promise<void>) | null;
}

export class CachedAssetsManager {
    /** The client that instantiated this */
    readonly enka: EnkaClient;
    /** Default path of genshin cache data directory */
    readonly defaultCacheDirectoryPath: string;
    /** List of the names of the files this library uses */
    readonly _contentsSrc: string[];
    /** List of supported languages */
    readonly _langs: string[];
    /** Path of directory where genshin cache data is stored */
    cacheDirectoryPath: string;

    _cacheUpdater: NodeJS.Timer | null;
    _githubCache: ConfigFile<typeof defaultJsonOptions> | null;
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

    /** Create the necessary folders and files, and if the directory [cacheDirectoryPath](#cacheDirectoryPath) did not exist, move the cache files from the default path. */
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
            this._githubCache = await new ConfigFile(githubCachePath, defaultJsonOptions, {
                "lastUpdate": 0,
                "rawLastUpdate": 0,
            }).load();
        }
    }

    /** Obtains a text map for a specific language. */
    async fetchLanguageData(lang: LanguageCode): Promise<Record<string, string>> {
        await this.cacheDirectorySetup();
        // TODO: better handling for languages with splitted files
        if (lang === "th") {
            const json1 = (await fetchJSON(`${contentBaseUrl}/TextMap/TextMap${lang.toUpperCase()}_0.json`, this.enka)).data;
            const json2 = (await fetchJSON(`${contentBaseUrl}/TextMap/TextMap${lang.toUpperCase()}_1.json`, this.enka)).data;
            return { ...json1, ...json2 };
        }
        const url = `${contentBaseUrl}/TextMap/TextMap${lang.toUpperCase()}.json`;
        const json = (await fetchJSON(url, this.enka)).data;
        return json;
    }

    /**
     * @param useRawGenshinData Whether to fetch from gitlab repo ({@link https://gitlab.com/Dimbreath/AnimeGameData}) instead of downloading cache.zip
     * @returns Whether the game data update is available or not.
     */
    async checkForUpdates(useRawGenshinData = false): Promise<boolean> {
        await this.cacheDirectorySetup();
        const url = getGitRemoteAPIUrl(useRawGenshinData, new Date(this._githubCache?.getValue("rawLastUpdate") as (number | null | undefined) ?? 0), new Date(this._githubCache?.getValue("lastUpdate") as (number | null | undefined) ?? 0));

        const res = await fetchJSON(url, this.enka);
        if (res.status !== 200) {
            throw new Error(`Request Failed: ${res.status} - ${res.statusText}`);
        }

        const data = res.data;

        return data.length !== 0;
    }

    /**
     * @param options.useRawGenshinData Whether to fetch from gitlab repo ({@link https://gitlab.com/Dimbreath/AnimeGameData}) instead of downloading cache.zip
     * @param options.ghproxy Whether to use ghproxy.com
     */
    async fetchAllContents(options: Partial<FetchContentsOptions> = {}): Promise<void> {
        if (this._isFetching) {
            throw new Error("You are already fetching assets.");
        }

        const mergedOptions = bindOptions({
            useRawGenshinData: false,
        }, options);

        await this.cacheDirectorySetup();

        this._isFetching = true;

        if (!mergedOptions.useRawGenshinData) {
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

            const promises: Promise<void>[] = [];
            const genshinData: Record<string, JsonArray> = {};
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

            const langsData: NullableLanguageMap = { ...initialLangDataMemory };
            const langPromises: Promise<void>[] = [];
            for (const lang of languages) {
                langPromises.push(
                    (async () => {
                        const data = await this.fetchLanguageData(lang);
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
                console.info("Parsing data...");
            }

            const clearLangsData = this.removeUnusedTextData(genshinData, langsData as LanguageMap);

            if (this.enka.options.showFetchCacheLog) {
                console.info("> Parsing completed");
                console.info("Saving into files...");
            }

            for (const lang of Object.keys(clearLangsData) as LanguageCode[]) {
                fs.writeFileSync(this.getLanguageDataPath(lang), JSON.stringify(clearLangsData[lang]));
            }

            for (const key in genshinData) {
                fs.writeFileSync(this.getJSONDataPath(key), JSON.stringify(genshinData[key]));
            }

            await this._githubCache?.set("rawLastUpdate", Date.now()).save();

            if (this.enka.options.showFetchCacheLog) {
                console.info(">> All Completed");
            }
        }
        this._isFetching = false;


    }

    /**
     * @returns whether all genshin cache data files exist.
     */
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
     * @param options.useRawGenshinData Whether to fetch from gitlab repo ({@link https://gitlab.com/Dimbreath/AnimeGameData}) instead of downloading cache.zip
     * @param options.ghproxy Whether to use ghproxy.com
     * @returns true if there were any updates, false if there were no updates.
     */
    async updateContents(options: Partial<UpdateContentsOptions> = {}): Promise<void> {
        const mergedOptions = bindOptions({
            useRawGenshinData: false,
            ghproxy: false,
            onUpdateStart: undefined,
            onUpdateEnd: undefined,
        }, options);

        await this.cacheDirectorySetup();

        const url = getGitRemoteAPIUrl(mergedOptions.useRawGenshinData, new Date((this._githubCache?.getValue("rawLastUpdate") ?? 0) as number), new Date((this._githubCache?.getValue("lastUpdate") ?? 0) as number));

        const res = await fetchJSON(url, this.enka);
        if (res.status !== 200) {
            throw new Error(`Request Failed: ${res.status} - ${res.statusText}`);
        }

        const data = res.data;

        if (data.length !== 0) {
            await mergedOptions.onUpdateStart?.();
            // fetch all because large file diff cannot be retrieved
            await this.fetchAllContents({ useRawGenshinData: mergedOptions.useRawGenshinData, ghproxy: mergedOptions.ghproxy });
            await mergedOptions.onUpdateEnd?.();
        }
    }

    /**
     * @param options.useRawGenshinData Whether to fetch from gitlab repo ({@link https://gitlab.com/Dimbreath/AnimeGameData}) instead of downloading cache.zip
     * @param options.ghproxy Whether to use ghproxy.com
     * @param options.timeout in milliseconds
     */
    activateAutoCacheUpdater(options: Partial<AutoCacheUpdaterOptions> = {}): void {
        const mergedOptions = bindOptions({
            useRawGenshinData: false,
            instant: true,
            ghproxy: false,
            timeout: 60 * 60 * 1000,
            onUpdateStart: null,
            onUpdateEnd: null,
            onError: null,
        }, options);
        if (mergedOptions.timeout as number < 60 * 1000) throw new Error("timeout cannot be shorter than 1 minute.");
        if (mergedOptions.instant) this.updateContents({ onUpdateStart: mergedOptions.onUpdateStart, onUpdateEnd: mergedOptions.onUpdateEnd, useRawGenshinData: mergedOptions.useRawGenshinData, ghproxy: mergedOptions.ghproxy });
        this._cacheUpdater = setInterval(async () => {
            if (this._isFetching) return;
            try {
                this.updateContents({ onUpdateStart: mergedOptions.onUpdateStart, onUpdateEnd: mergedOptions.onUpdateEnd, useRawGenshinData: mergedOptions.useRawGenshinData, ghproxy: mergedOptions.ghproxy });
            } catch (e) {
                if (e instanceof Error) mergedOptions.onError?.(e);
            }
        }, mergedOptions.timeout);
    }

    /**
     * Disables the updater activated by [activateAutoCacheUpdater](#activateAutoCacheUpdater)
     */
    deactivateAutoCacheUpdater(): void {
        if (this._cacheUpdater !== null) {
            clearInterval(this._cacheUpdater);
            this._cacheUpdater = null;
        }
    }

    /**
     * @returns text map file path for a specific language
     */
    getLanguageDataPath(lang: LanguageCode, directory?: string): string {
        const relativeDir = directory ? ["langs", directory] : ["langs"];
        return path.resolve(this.cacheDirectoryPath, ...relativeDir, `${lang}.json`);
    }

    /**
     * @param name without extensions (.json)
     * @returns excel bin file path
     */
    getJSONDataPath(name: string): string {
        return path.resolve(this.cacheDirectoryPath, "data", `${name}.json`);
    }

    /**
     * @param name without extensions (.json)
     */
    getGenshinCacheData(name: string): JsonReader<typeof excelJsonOptions> {
        dataMemory[name] ??= new JsonReader(excelJsonOptions, JSON.parse(fs.readFileSync(this.getJSONDataPath(name), "utf-8")));
        return dataMemory[name];
    }

    /**
     * @returns text map for a specific language
     */
    getLanguageData(lang: LanguageCode, directory?: string): JsonObject<string> {
        // Avoid "js/prototype-polluting-assignment" just in case. (https://github.com/yuko1101/enka-network-api/security/code-scanning/252)
        if (["__proto__", "constructor", "prototype"].includes(lang)) return {};
        langDataMemory[lang] ??= JSON.parse(fs.readFileSync(this.getLanguageDataPath(lang), "utf-8"));
        if (directory) {
            const loadedJson = JSON.parse(fs.readFileSync(this.getLanguageDataPath(lang, directory), "utf-8"));
            langDataMemory[lang] = Object.assign(langDataMemory[lang] as JsonObject, loadedJson);
        }
        return langDataMemory[lang] ?? {};
    }

    /**
     * @returns ObjectKeysManager of this
     */
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
     * Remove all unused text map entries
     */
    removeUnusedTextData(data: Record<string, JsonArray>, langsData: LanguageMap, showLog = true): LanguageMap {
        const required: number[] = [];

        function push(...keys: number[]) {
            const len = keys.length;
            for (let i = 0; i < len; i++) {
                const key = keys[i];
                if (!required.includes(key)) required.push(key);
            }
        }

        push(...textMapWhiteList);

        data["AvatarExcelConfigData"].forEach(c => {
            const json = new JsonReader(excelJsonOptions, c);
            push(
                json.getAsNumber("nameTextMapHash"),
                json.getAsNumber("descTextMapHash"),
            );
        });
        data["FetterInfoExcelConfigData"].forEach(c => {
            const json = new JsonReader(excelJsonOptions, c);
            push(
                json.getAsNumber("avatarNativeTextMapHash"),
                json.getAsNumber("avatarVisionBeforTextMapHash"),
                json.getAsNumber("avatarConstellationAfterTextMapHash"),
                json.getAsNumber("avatarConstellationBeforTextMapHash"),
                json.getAsNumber("avatarTitleTextMapHash"),
                json.getAsNumber("avatarDetailTextMapHash"),
                json.getAsNumber("cvChineseTextMapHash"),
                json.getAsNumber("cvJapaneseTextMapHash"),
                json.getAsNumber("cvEnglishTextMapHash"),
                json.getAsNumber("cvKoreanTextMapHash"),
            );
        });
        data["AvatarCostumeExcelConfigData"].forEach(c => {
            const json = new JsonReader(excelJsonOptions, c);
            push(json.getAsNumber("nameTextMapHash"), json.getAsNumber("descTextMapHash"));
        });
        data["AvatarSkillExcelConfigData"].forEach(s => {
            const json = new JsonReader(excelJsonOptions, s);
            push(json.getAsNumber("nameTextMapHash"), json.getAsNumber("descTextMapHash"));
        });
        data["ProudSkillExcelConfigData"].forEach(p => {
            const json = new JsonReader(excelJsonOptions, p);
            push(json.getAsNumber("nameTextMapHash"), json.getAsNumber("descTextMapHash"), ...(json.has("paramDescList") ? json.get("paramDescList").mapArray((_, e) => e.getAsNumber()) : []));
        });
        data["AvatarTalentExcelConfigData"].forEach(c => {
            const json = new JsonReader(excelJsonOptions, c);
            push(json.getAsNumber("nameTextMapHash"), json.getAsNumber("descTextMapHash"));
        });

        data["WeaponExcelConfigData"].forEach(w => {
            const json = new JsonReader(excelJsonOptions, w);
            push(json.getAsNumber("nameTextMapHash"), json.getAsNumber("descTextMapHash"));
        });
        data["EquipAffixExcelConfigData"].forEach(a => {
            const json = new JsonReader(excelJsonOptions, a);
            push(json.getAsNumber("nameTextMapHash"), json.getAsNumber("descTextMapHash"));
        });
        data["ReliquaryExcelConfigData"].forEach(a => {
            const json = new JsonReader(excelJsonOptions, a);
            push(json.getAsNumber("nameTextMapHash"), json.getAsNumber("descTextMapHash"));
        });

        data["ManualTextMapConfigData"].forEach(m => {
            const json = new JsonReader(excelJsonOptions, m);
            const id = json.getAsString("textMapId");
            if (!manualTextMapWhiteList.includes(id) && !id.startsWith("FIGHT_REACTION_") && !id.startsWith("FIGHT_PROP_") && !id.startsWith("PROP_") && !id.startsWith("WEAPON_")) return;
            push(json.getAsNumber("textMapContentTextMapHash"));
        });

        data["MaterialExcelConfigData"].forEach(m => {
            const json = new JsonReader(excelJsonOptions, m);
            push(json.getAsNumber("nameTextMapHash"), json.getAsNumber("descTextMapHash"));
        });

        data["ProfilePictureExcelConfigData"].forEach(p => {
            const json = new JsonReader(excelJsonOptions, p);
            push(json.getAsNumber("nameTextMapHash"));
        });

        const requiredStringKeys = required.filter(key => key).map(key => key.toString());
        const keyCount = requiredStringKeys.length;

        if (showLog) console.info(`Required keys have been loaded (${keyCount.toLocaleString()} keys)`);

        const clearLangsData: NullableLanguageMap = { ...initialLangDataMemory };

        for (const lang of Object.keys(langsData) as LanguageCode[]) {
            if (showLog) console.info(`Modifying language "${lang}"...`);
            clearLangsData[lang] = {};
            for (let i = 0; i < keyCount; i++) {
                const key = requiredStringKeys[i];
                const text = langsData[lang][key];
                if (text) {
                    (clearLangsData[lang] as JsonObject)[key] = text;
                } else {
                    // console.warn(`Required key ${key} was not found in language ${lang}.`);
                }
            }
        }

        if (showLog) console.info("Removing unused keys completed.");

        return clearLangsData as LanguageMap;
    }

    /**
     * Download the zip file, which contains genshin cache data, from {@link https://raw.githubusercontent.com/yuko1101/enka-network-api/main/cache.zip}
     * @param options.ghproxy Whether to use ghproxy.com
     */
    async _downloadCacheZip(options: { ghproxy?: boolean } = {}): Promise<void> {
        options = bindOptions({
            ghproxy: false,
        }, options);

        const url = (options.ghproxy ? "https://ghproxy.com/" : "") + "https://raw.githubusercontent.com/yuko1101/enka-network-api/main/cache.zip";

        const res = await axios.get(url, {
            responseType: "stream",
        }).catch(e => {
            throw new Error(`Failed to download genshin data from ${url} with an error: ${e}`);
        });
        if (res.status == 200) {
            await new Promise<void>(resolve => {
                res.data
                    .pipe(unzip.Parse())
                    .on("entry", (entry: Entry) => {
                        const entryPath = entry.path.replace(/^cache\/?/, "");
                        const extractPath = path.resolve(this.cacheDirectoryPath, entryPath);

                        if (this.enka.options.showFetchCacheLog) console.info(`- Downloading ${entryPath}`);

                        if (entry.type === "Directory") {
                            if (!fs.existsSync(extractPath)) fs.mkdirSync(extractPath, { recursive: true });
                            entry.autodrain();
                        } else if (entryPath.startsWith("github/")) {
                            if (fs.existsSync(extractPath)) {
                                entry.autodrain();
                                return;
                            }
                            entry.pipe(fs.createWriteStream(extractPath));
                        } else {
                            entry.pipe(fs.createWriteStream(extractPath));
                        }
                    });
                res.data.on("close", () => {
                    resolve();
                });
            });
        } else {
            throw new Error(`Failed to download genshin data from ${url} with status ${res.status} - ${res.statusText}`);
        }
    }

    /**
     * @returns whether the cache is valid or not
     */
    _validateCache(showLog = true): boolean {
        return validateCache(this.enka, showLog);
    }
}
