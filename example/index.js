const { EnkaClient } = require("enka-network-api");

run();


async function run() {
    const client = new EnkaClient({ timeout: 4000 });
    console.log(await client.fetchUser(825436941));
}