const { EnkaClient } = require("enka-network-api");
const { StarRail } = require("starrail.js");

const starrailClient = new StarRail();
const enka = new EnkaClient({ starrailClient });

(async () => {
    const enkaUsers = await enka.fetchAllEnkaUsers("your enka account username");
    for (const enkaUser of enkaUsers) {
        const builds = await enkaUser.fetchBuilds();
        const buildList = Object.values(builds).flat();
        for (const build of buildList) {
            console.log(build.hoyoType === 1 ? "StarRail" : "GenshinImpact", build.character.characterData.name.get());
        }
    }
})();

/* Example output:
StarRail March 7th
StarRail Silver Wolf
StarRail Asta
StarRail Seele
StarRail Seele
StarRail Gepard
StarRail Natasha
StarRail Clara
StarRail Tingyun
StarRail Jing Yuan
StarRail Sushang
StarRail {NICKNAME}
GenshinImpact Kamisato Ayaka
GenshinImpact Jean
GenshinImpact Traveler
GenshinImpact Amber
GenshinImpact Xiangling
GenshinImpact Xingqiu
GenshinImpact Zhongli
GenshinImpact Fischl
GenshinImpact Bennett
GenshinImpact Ganyu
GenshinImpact Diona
GenshinImpact Keqing
GenshinImpact Sucrose
GenshinImpact Hu Tao
GenshinImpact Kaedehara Kazuha
GenshinImpact Yoimiya
GenshinImpact Raiden Shogun
GenshinImpact Sangonomiya Kokomi
GenshinImpact Yae Miko
GenshinImpact Shikanoin Heizou
GenshinImpact Yelan
GenshinImpact Shenhe
GenshinImpact Yun Jin
GenshinImpact Kuki Shinobu
GenshinImpact Collei
GenshinImpact Nilou
GenshinImpact Nahida
GenshinImpact Wanderer
GenshinImpact Faruzan
GenshinImpact Yaoyao
 */