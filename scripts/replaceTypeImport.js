const fs = require("fs");

const typeImportRegex = /import\((.+?)\)(?:\.([a-zA-Z0-9$_.]+))?/;

function searchFilesInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const loadedFile = fs.lstatSync(`${dir}/${file}`);
        if (loadedFile.isDirectory()) {
            searchFilesInDir(`${dir}/${file}`);
        } else if (file.endsWith(".js")) {
            replaceTypeImport(`${dir}/${file}`);
        }
    }
}

function replaceTypeImport(filePath) {
    const content = fs.readFileSync(filePath, { encoding: "utf-8" });
    if (typeImportRegex.test(content)) {
        const replacedContent = content.replace(new RegExp(typeImportRegex, "g"), ($0, $1, $2) => {
            if ($2) {
                const split = $2.replace(/\.default$/, "").split(".");
                return split[split.length - 1];
            } else {
                return $1.slice(1, -1).match(/[^/]+$/)[0].replace(/\.[^.]+$/, "");
            }
        });
        fs.writeFileSync(filePath, replacedContent);
    }
}

// run this from /docs
searchFilesInDir("../src");