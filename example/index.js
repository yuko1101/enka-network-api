const { EnkaClient } = require("enka-network-api");
const enka = new EnkaClient({ timeout: 4000, defaultLanguage: "jp" });

async function run() {
    const user = await enka.fetchUser(825436941);
    const names = user.characters.map(c => c.characterData.name.get("en"));

    console.log(names);

}

run();