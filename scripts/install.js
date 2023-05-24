const fs = require("fs");

const nocache = process.env.npm_config_enka_nocache;
const ghproxy = process.env.npm_config_enka_ghproxy;

function getBool(value) {
    return value?.toLowerCase() === "true" || value === "1";
}

if (getBool(nocache)) {
    if (!fs.existsSync("cache")) {
        // create folder not to download the data when install other packages.
        fs.mkdirSync("cache");
    }
    return;
}

if (fs.existsSync("cache")) return;

const { EnkaClient } = require("..");
const enka = new EnkaClient();

enka.cachedAssetsManager._downloadCacheZip({ ghproxy: getBool(ghproxy) });