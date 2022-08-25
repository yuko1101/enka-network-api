const { EnkaClient } = require("../types");

run();


async function run() {
    const client = new EnkaClient();
    console.log(await client.fetchUser(825436941));
}