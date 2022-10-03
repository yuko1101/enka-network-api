# enka-network-api

## About

An enka-network API wrapper for Genshin Impact.

## Installation

```sh-session
npm install enka-network-api
```

## Fetching Player Data

```js
const { EnkaClient } = require("enka-network-api");
const enka = new EnkaClient({ timeout: 4000 });

enka.fetchUser(825436941).then(user => {
  console.log(user);
});
```
