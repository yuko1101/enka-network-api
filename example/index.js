const { EnkaClient } = require("enka-network-api");

run();


async function run() {
    const client = new EnkaClient({ timeout: 4000 });
    // await client.cachedAssetsManager.fetchAllContents();
    const user = await client.fetchUser(825436941);

    console.log(user.avatarInfoList[0].avatar.skills[0].description.get("jp"));
    setInterval(() => { }, 1000);
}