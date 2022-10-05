const { EnkaClient } = require("enka-network-api");

run();


async function run() {
    const client = new EnkaClient({ timeout: 4000, defaultLanguage: "jp" });
    // await client.cachedAssetsManager.fetchAllContents();
    const user = await client.fetchUser(825436941);

    console.log(user.avatarInfoList[3].weapon.refinement.description.get());
    setInterval(() => { }, 1000);
}