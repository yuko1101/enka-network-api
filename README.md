# EnkaNetworkAPI

<div align="center">
	<p>
		<a href="https://www.npmjs.com/package/enka-network-api"><img src="https://img.shields.io/npm/v/enka-network-api.svg?maxAge=3600" alt="npm version" /></a>
		<a href="https://www.npmjs.com/package/enka-network-api"><img src="https://img.shields.io/npm/dt/enka-network-api.svg?maxAge=3600" alt="npm downloads" /></a>
		<a href="https://github.com/yuko1101/enka-network-api/actions/workflows/codeql.yml"><img src="https://github.com/yuko1101/enka-network-api/actions/workflows/codeql.yml/badge.svg"/></a>
    	<a href="https://github.com/yuko1101/enka-network-api/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg"/></a>
	</p>
</div>

![Enka.Network](https://github.com/yuko1101/enka-network-api/blob/main/img/enka-splash.png?raw=true)


## About

An enka.network API wrapper for Genshin Impact.

## Installation

**Node.js 16 or newer is required.**

Install enka-network-api including genshin cache data.
```sh-session
npm install enka-network-api
```
<details>
    <summary>Install using ghproxy.com</summary>
    
    npm install enka-network-api --enka-ghproxy=true
</details>
<br>

If you have already moved the cache to another folder, you can also install without downloading the cache.
```sh-session
npm install enka-network-api --enka-nocache=true
```

## About Genshin Cache Data
You can change your cache directory.
```js
// Change the directory to store cache data.
// Default directory is **/enka-network-api/cache.
// Re-fetching contents may be required, if you update 
// enka-network-api with the cache directory in it.
const enka = new EnkaClient();
enka.cachedAssetsManager.cacheDirectoryPath = "./cache";
enka.cachedAssetsManager.cacheDirectorySetup();

// OR

const enka = new EnkaClient({ cacheDirectory: "./cache" });
enka.cachedAssetsManager.cacheDirectorySetup();

```

Also, you can activate auto cache updater.

When using the auto-cache updater, we strongly recommend moving the cache directory directly under your project folder. (**DO NOT delete \*\*/enka-network-api/cache, just delete all folders/files in it when moving directory.**)

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

# How to use

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
// print weapon names with language "jp"
console.log(weapons.map(w => w.name.get("jp")));
```

For more information, please check [Documentation](https://enka-network-api.vercel.app/docs/api/EnkaClient).