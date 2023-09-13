const fs = require("fs");

const nocache = process.env.npm_config_enka_nocache;
const ghproxy = process.env.npm_config_enka_ghproxy;

function getBool(value) {
    return value?.toLowerCase() === "true" || value === "1";
}

if (getBool(nocache)) {
    if (!fs.existsSync("installed")) {
        // create a dummy file not to download the data on install other packages.
        fs.writeFileSync("installed", "");
    }
    return;
}

if (fs.existsSync("installed")) return;

const { EnkaClient } = require("..");
const enka = new EnkaClient();

enka.cachedAssetsManager._downloadCacheZip({ ghproxy: getBool(ghproxy) });

fs.writeFileSync("installed", "");