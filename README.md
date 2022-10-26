# enka-network-api

## About

An enka-network API wrapper for Genshin Impact.

## Installation

**Node.js 16 or newer is required.**

Install enka-network-api.
```sh-session
npm install enka-network-api
```

First of all, you need to generate genshin data cache.

It will take a few minutes. Just wait.
```js
const { EnkaClient } = require("enka-network-api");
const enka = new EnkaClient();

console.log("Fetching Genshin Data...");
enka.cachedAssetsManager.fetchAllContents().then(() => {
  console.log("Fetching Completed!");
});
```

OR, just activate auto cache updater.

```js
const { EnkaClient } = require("enka-network-api");
const enka = new EnkaClient();

enka.cachedAssetsManager.activateAutoCacheUpdater({
    instant: true, // Run the first update check immediately
    timeout: 60 * 60 * 1000, // 1 hour interval
    onUpdateStart: async () => {
        console.log("Updating Genshin Data...");
    },
    onUpdateEnd: async () => {
        console.log("Updating Completed!");
    }
});

// // deactivate
// enka.cachedAssetsManager.deactivateAutoCacheUpdater();
```

## Fetching Player Data

```js
const { EnkaClient } = require("enka-network-api");
const enka = new EnkaClient();

enka.fetchUser(825436941).then(user => {
  console.log(user);
});
```

## Genshin Character List

```js
const { EnkaClient } = require("enka-network-api");
const enka = new EnkaClient();

const characters = enka.getAllCharacters();
// print character names with language "en"
console.log(characters.map(c => c.name.get("en")));
```

## Genshin Weapon List

```js
const { EnkaClient } = require("enka-network-api");
const enka = new EnkaClient();

const weapons = enka.getAllWeapons();
// print weapons names with language "jp"
console.log(weapons.map(w => w.name.get("jp")));
```