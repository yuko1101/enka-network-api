const EnkaClient = require("./EnkaClient");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

// Thanks @mrwan200
const contentBaseUrl = "https://raw.githubusercontent.com/mrwan200/enkanetwork.py-data/master/exports";

const types = ["data", "langs"];
const categories = ["artifact_sets", "artifacts", "characters", "constellations", "costumes", "fight_props", "namecards", "skills", "weapons"]

// Thanks @Dimbreath
const otherData = [
    "https://raw.githubusercontent.com/Dimbreath/GenshinData/master/ExcelBinOutput/ReliquaryAffixExcelConfigData.json",
    "https://raw.githubusercontent.com/Dimbreath/GenshinData/master/ExcelBinOutput/WeaponExcelConfigData.json",
    "https://raw.githubusercontent.com/Dimbreath/GenshinData/master/ExcelBinOutput/ProudSkillExcelConfigData.json"
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
     * @param {"data" | "langs"} type
     * @param {"artifact_sets" | "artifacts" | "characters" | "constellations" | "costumes" | "fight_props" | "namecards" | "skills" | "weapons"} category
     * @returns {Promise<object>}
     */
    async fetchContent(type, category) {
        const res = await fetch(`${contentBaseUrl}/${type}/${category}.json`);
        const json = await res.json();
        fs.writeFileSync(path.resolve(this.cacheDirectoryPath, type, `${category}.json`), JSON.stringify(json));
        return json;
    }

    /**
     * @param {"data" | "langs"} type
     * @param {"artifact_sets" | "artifacts" | "characters" | "constellations" | "costumes" | "fight_props" | "namecards" | "skills" | "weapons"} category
     * @returns {string}
     */
    getAssetsPath(type, category) {
        return path.resolve(this.cacheDirectoryPath, type, `${category}.json`);
    }

    async fetchAllContents() {
        const promises = [];
        for (const type of types) for (const category of categories) {
            // use more detailed json instead
            if (type === "data" && category === "weapons") continue;

            promises.push(this.fetchContent(type, category));
        }
        for (const url of otherData) {
            const fileName = url.split("/").pop();
            promises.push((async () => {
                const res = await fetch(url);
                const json = await res.json();
                fs.writeFileSync(path.resolve(this.cacheDirectoryPath, "data", fileName), JSON.stringify(json));
                return json;
            })())
        }
        await Promise.all(promises);
    }

    /**
     * @returns {boolean}
     */
    hasAllContents() {
        for (const type of types) for (const category of categories) {
            // use more detailed json instead
            if (type === "data" && category === "weapons") continue;
            if (!fs.existsSync(this.getAssetsPath(type, category))) return false;
        }
        for (const url of otherData) {
            const fileName = url.split("/").pop();
            if (!fs.existsSync(path.resolve(this.cacheDirectoryPath, "data", fileName))) return false;
        }
        return true;
    }
}