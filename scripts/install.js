const fs = require("fs");

const nocache = process.env.npm_config_enka_nocache;

if (nocache === "true" || nocache === "1") {
    if (!fs.existsSync("cache")) {
        // create folder not to download the data when install other packages.
        fs.mkdirSync("cache");
    }
    return;
}

if (fs.existsSync("cache")) return;

const { EnkaClient } = require("..");
const enka = new EnkaClient();

enka.cachedAssetsManager._downloadCacheZip();