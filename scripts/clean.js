const fs = require("fs");

if (fs.existsSync("dist")) {
    deleteFiles("dist");
}

function deleteFiles(path) {
    const target = fs.statSync(path);
    if (!target.isDirectory()) {
        fs.unlinkSync(path);
        return;
    }
    const files = fs.readdirSync(path);
    for (const file of files) {
        deleteFiles(path + "/" + file);
    }
}