const fs = require("fs");

/**
 * @param {string} dirFrom 
 * @param {string} dirTo 
 */
module.exports.move = (dirFrom, dirTo) => {
    const files = fs.readdirSync(dirFrom);
    for (const file of files) {
        const loadedFile = fs.lstatSync(`${dirFrom}/${file}`);
        if (loadedFile.isDirectory()) {
            fs.mkdirSync(`${dirTo}/${file}`);
            this.move(`${dirFrom}/${file}`, `${dirTo}/${file}`);
            fs.rmdirSync(`${dirFrom}/${file}`);
        } else {
            this.moveFile(`${dirFrom}/${file}`, `${dirTo}/${file}`);
        }
    }

}

/**
 * @param {string} fileFrom
 * @param {string} fileTo
 */
module.exports.moveFile = (fileFrom, fileTo) => {
    fs.renameSync(fileFrom, fileTo);
}