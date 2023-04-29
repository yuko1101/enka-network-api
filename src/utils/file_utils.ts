import fs from "fs";

/**
 * @param dirFrom
 * @param dirTo
 */
export function move(dirFrom: string, dirTo: string) {
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
 * @param fileFrom
 * @param fileTo
 */
export function moveFile(fileFrom: string, fileTo: string) {
    fs.renameSync(fileFrom, fileTo);
}