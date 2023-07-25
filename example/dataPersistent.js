/*
You can store most enka-network-api structures as json,
and restore them whenever you want.
 */

const { EnkaClient, CharacterData, User } = require("enka-network-api");
const enka = new EnkaClient();

// Kamisato Ayaka
const ayaka = enka.getCharacterById(10000002);

// Get the character data as json
const ayakaJson = ayaka._data;

// Restore character data from json
const ayaka2 = new CharacterData(ayakaJson, enka);


// If you want to restore Travelers and their elements,
// you need to store CharacterData#skillDepotId as well.
const lumine = enka.getCharacterById(10000007);

const lumineJson = lumine._data;
const skillDepotId = lumine.skillDepotId;

const lumine2 = new CharacterData(lumineJson, enka, skillDepotId);


// Storing user data
const user = await enka.fetchUser(825436941);

const userJson = user._data;

const user2 = new User(userJson, enka);