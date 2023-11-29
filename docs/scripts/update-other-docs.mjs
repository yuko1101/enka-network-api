import * as fs from "fs";

if (!fs.existsSync("./docs")) {
    fs.mkdirSync("./docs");
}

// copy the README.md file to the docs folder
fs.copyFileSync("../README.md", "./docs/README.md");