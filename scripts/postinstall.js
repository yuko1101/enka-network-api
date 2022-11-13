const nocache = npm_config_enka_nocache;
if (nocache === "true" || nocache === "1") return;

const request = require("request");
const fs = require("fs");
const unzip = require("unzip");

request.get("https://raw.githubusercontent.com/yuko1101/enka-network-api/main/cache.zip")
    .pipe(fs.createWriteStream("cache.zip"))
    .on("close", () => {
        fs.createReadStream("cache.zip")
            .pipe(unzip.Extract({ path: "./" }));
    });