# enka-network-api

## About

An enka-network API wrapper for Genshin Impact.

## Installation

Install enka-network-api
```sh-session
npm install enka-network-api
```

First of all, you need to generate genshin data cache.
It will take a few minutes. Just wait.
```js
const { EnkaClient } = require("enka-network-api");
const enka = new EnkaClient({ timeout: 4000 });

console.log("Fetching Genshin Data...");
enka.cachedAssetsManager.fetchAllContents().then(() => {
  console.log("Fetching completed!");
});
```

## Fetching Player Data

```js
const { EnkaClient } = require("enka-network-api");
const enka = new EnkaClient({ timeout: 4000 });

enka.fetchUser(825436941).then(user => {
  console.log(user);
});
```
