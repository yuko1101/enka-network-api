# EnkaNetworkAPI

![Enka.Network](https://github.com/yuko1101/enka-network-api/blob/main/docs/static/img/enka-splash.png?raw=true)

<div align="center">
	<p>
		<a href="https://www.npmjs.com/package/enka-network-api"><img src="https://img.shields.io/npm/v/enka-network-api.svg?maxAge=3600" alt="npm version" /></a>
		<a href="https://www.npmjs.com/package/enka-network-api"><img src="https://img.shields.io/npm/dt/enka-network-api.svg?maxAge=3600" alt="npm downloads" /></a>
		<a href="https://github.com/yuko1101/enka-network-api/actions/workflows/codeql.yml"><img src="https://github.com/yuko1101/enka-network-api/actions/workflows/codeql.yml/badge.svg"/></a>
    	<a href="https://github.com/yuko1101/enka-network-api/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg"/></a>
	</p>
</div>

<div align="center">
    <a href="https://enka-network-api.vercel.app/docs/api/EnkaClient">
        <b>&lt;/&gt; Documentation</b>
    </a>
    <b> | </b>
    <a href="https://www.npmjs.com/package/enka-network-api">
        <b>⚙ NPM</b>
    </a>
    <b> | </b>
    <i class="fab fa-github"></i>
    <a href="https://github.com/yuko1101/enka-network-api">
        <b> GitHub</b>
    </a>
</div>

## About

A Node.js Enka.Network API wrapper for Genshin Impact.

**This is NOT the source code of Enka.Network or its API.**

> [!TIP]
> If you need a wrapper for Honkai: Star Rail, you can use [starrail.js](https://github.com/yuko1101/starrail.js).

### Features
- User Data and Character Stats using EnkaNetwork.
- All Characters and All Weapons Data. (Including More Advanced Info, such as Skill Attributes and Weapon Refinements.)
- Cache Updater for the new update of Genshin Impact. (Update characters and weapons immediately.)
- Honkai: Star Rail support with [starrail.js](https://github.com/yuko1101/starrail.js) integration. (See the example [here](https://github.com/yuko1101/enka-network-api/blob/main/example/starrail.js-integration.js).)


## Installation

**Node.js 16 or newer is required.**

Install enka-network-api including genshin cache data.
```sh-session
npm install enka-network-api@latest
```
<details>
    <summary>Install using ghproxy.com</summary>
    
    npm install enka-network-api@latest --enka-ghproxy=true
</details>
<br/>

If you have already moved the cache to another folder, you can also install without downloading the cache.
```sh-session
npm install enka-network-api@latest --enka-nocache=true
```

## About Genshin Cache Data
Genshin cache data is from [Dimbreath/GenshinData](https://github.com/Dimbreath/GenshinData) (private repo).

This data contains data of characters, weapons, materials, and more structure information of Genshin Impact.

You can change your cache directory.
```js
const { EnkaClient } = require("enka-network-api");

// Change the directory to store cache data.
// Default directory is node_modules/enka-network-api/cache.
const enka = new EnkaClient();
enka.cachedAssetsManager.cacheDirectoryPath = "./cache";
enka.cachedAssetsManager.cacheDirectorySetup();

// OR

const enka = new EnkaClient({ cacheDirectory: "./cache" });
enka.cachedAssetsManager.cacheDirectorySetup();

```

### Updating

You can update your genshin cache data.
```js
const { EnkaClient } = require("enka-network-api");
const enka = new EnkaClient({ showFetchCacheLog: true }); // showFetchCacheLog is true by default

enka.cachedAssetsManager.fetchAllContents(); // returns promise
```


Also, you can activate auto cache updater.

When using the auto-cache updater, we recommend moving the cache directory directly under your project folder.

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
        enka.cachedAssetsManager.refreshAllData(); // Refresh memory
        console.log("Updating Completed!");
    }
});

// // deactivate
// enka.cachedAssetsManager.deactivateAutoCacheUpdater();
```

# How to use

## Fetching Player Data 
[EnkaClient#fetchUser](https://enka-network-api.vercel.app/docs/api/EnkaClient#fetchUser)
```js
const { EnkaClient } = require("enka-network-api");
const enka = new EnkaClient();

enka.fetchUser(825436941).then(user => {
  console.log(user);
});
```

## Genshin Character List
[EnkaClient#getAllCharacters](https://enka-network-api.vercel.app/docs/api/EnkaClient#getAllCharacters)
```js
const { EnkaClient } = require("enka-network-api");
const enka = new EnkaClient();

const characters = enka.getAllCharacters();
// print character names in language "en"
console.log(characters.map(c => c.name.get("en")));
```

## Genshin Weapon List
[EnkaClient#getAllWeapons](https://enka-network-api.vercel.app/docs/api/EnkaClient#getAllWeapons)
```js
const { EnkaClient } = require("enka-network-api");
const enka = new EnkaClient();

const weapons = enka.getAllWeapons();
// print weapon names in language "jp"
console.log(weapons.map(w => w.name.get("jp")));
```

More examples are available in [example](https://github.com/yuko1101/enka-network-api/tree/main/example) folder.

For more information, please check [Documentation](https://enka-network-api.vercel.app/docs/api/EnkaClient).

You can see the changelog [here](https://github.com/yuko1101/enka-network-api/blob/main/CHANGELOG.md).
