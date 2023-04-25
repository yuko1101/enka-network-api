import fs from "fs";

/**
 * @param {string} dirFrom
 * @param {string} dirTo
 */
export function move(dirFrom, dirTo) {
    const files = fs.readdirSync(dirFrom);
    for (const file of files) {
        const loadedFile = fs.lstatSync(`${dirFrom}/${file}`);
        if (loadedFile.isDirectory()) {
            fs.mkdirSync(`${dirTo}/${file}`);
            move(`${dirFrom}/${file}`, `${dirTo}/${file}`);
            fs.rmdirSync(`${dirFrom}/${file}`);
        } else {
            moveFile(`${dirFrom}/${file}`, `${dirTo}/${file}`);
        }
    }
}

/**
 * @param {string} fileFrom
 * @param {string} fileTo
 */
export function moveFile(fileFrom, fileTo) {
    fs.renameSync(fileFrom, fileTo);
}