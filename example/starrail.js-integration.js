const { EnkaSystem } = require("enka-system");
const { EnkaClient, CharacterData: GenshinCharacterData } = require("enka-network-api");
const { StarRail, CharacterData: StarRailCharacterData } = require("starrail.js");

// these instances are automatically registered to `EnkaSystem.instance`, and considered to be a pair. (the second or later instance requires new EnkaSystem instance. see bottom of this file for more details.)
const enka = new EnkaClient();
const sr = new StarRail();

(async () => {
    const enkaSystem = EnkaSystem.instance; // or enka.options.enkaSystem, or sr.options.enkaSystem
    const gameAccounts = await enkaSystem.fetchEnkaGameAccounts("see");
    for (const account of gameAccounts) {
        const builds = await account.fetchBuilds();
        const buildList = Object.values(builds).flat();
        for (const build of buildList) {
            // genshin impact
            if (build.hoyoType === 0) {
                /** @type {GenshinCharacterData} */
                const characterData = build.character.characterData;
                console.log("GI", characterData.name.get(), characterData.element.name.get());
            }
            // honkai: star rail
            else if (build.hoyoType === 1) {
                /** @type {StarRailCharacterData} */
                const characterData = build.character.characterData;
                console.log("SR", characterData.name.get(), characterData.path.name.get());
            }
        }
    }
})();

/* Example output:
SR March 7th Preservation
SR Kafka Nihility
SR Silver Wolf Nihility
SR Asta Harmony
SR Seele The Hunt
SR Gepard Preservation
SR Natasha Abundance
SR Clara Destruction
SR Tingyun Harmony
SR Jing Yuan Erudition
SR Sushang The Hunt
SR Dan Heng • Imbibitor Lunae Destruction
SR {NICKNAME} Preservation
GI Kamisato Ayaka Cryo
GI Jean Anemo
GI Traveler Dendro
GI Amber Pyro
GI Xiangling Pyro
GI Xingqiu Hydro
GI Zhongli Geo
GI Fischl Electro
GI Bennett Pyro
GI Ganyu Cryo
GI Diona Cryo
GI Keqing Electro
GI Sucrose Anemo
GI Hu Tao Pyro
GI Kaedehara Kazuha Anemo
GI Yoimiya Pyro
GI Raiden Shogun Electro
GI Sangonomiya Kokomi Hydro
GI Yae Miko Electro
GI Shikanoin Heizou Anemo
GI Yelan Hydro
GI Shenhe Cryo
GI Yun Jin Geo
GI Kuki Shinobu Electro
GI Collei Dendro
GI Nilou Hydro
GI Nahida Dendro
GI Wanderer Anemo
GI Faruzan Anemo
GI Yaoyao Dendro
 */


// if you wanted to use multiple instances of EnkaClient or StarRail, you need to create new EnkaSystem instance.
const enkaSystem = new EnkaSystem();
const enka2 = new EnkaClient({ enkaSystem: enkaSystem });
const sr2 = new StarRail({ enkaSystem: enkaSystem });

// these instances are registered to `enkaSystem`, and considered to be a pair.


// if you don't need to link EnkaClient and StarRail, you don't need to pass the enkaSystem option. (it will create new EnkaSystem instance internally.)
const enka3 = new EnkaClient();
const sr3 = new StarRail();

// these instances are NOT considered to be a pair.