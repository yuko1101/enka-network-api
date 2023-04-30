const fs = require("fs");

function generateForDir(dir) {
    const exportFrom = [];
    const files = fs.readdirSync(dir);
    for (const fileName of files) {

        const file = fs.lstatSync(`${dir}/${fileName}`);
        if (file.isDirectory()) {
            generateForDir(`${dir}/${fileName}`);
        }
        if (fileName !== "index.ts") exportFrom.push(`./${fileName.replace(/\.ts$/, "")}`);
    }

    fs.writeFileSync(`${dir}/index.ts`, exportFrom.map(path => `export * from "${path}";`).join("\n"));
}

generateForDir("./src")