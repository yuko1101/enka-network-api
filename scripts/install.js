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

const { Axios } = require("axios");
const unzipper = require("unzipper");

const axios = new Axios({});

const url = "https://raw.githubusercontent.com/yuko1101/enka-network-api/main/cache.zip";

axios.get(url, {
    responseType: "stream"
}).then(res => {
    if (res.status == 200) {
        res.data.pipe(fs.createWriteStream("cache.zip"));
        res.data.on("end", () => {
            fs.createReadStream("cache.zip")
                .pipe(unzipper.Extract({ path: "./" }))
                .on("close", () => {
                    fs.rmSync("cache.zip");
                });
        });
    } else {
        throw new Error(`Failed to download genshin data from ${url} with status ${res.status} - ${res.statusText}`);
    }
}).catch(e => {
    throw new Error(`Failed to download genshin data from ${url} with an error: ${e}`);
});