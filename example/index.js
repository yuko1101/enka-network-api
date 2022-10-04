const { EnkaClient } = require("enka-network-api");

run();


async function run() {
    const client = new EnkaClient({ timeout: 4000 });
    // await client.cachedAssetsManager.fetchAllContents();
    console.log(await client.fetchUser(825436941, false));
    setInterval(() => { }, 1000);
}