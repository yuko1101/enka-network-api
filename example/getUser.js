const { EnkaClient, DetailedGenshinUser } = require("enka-network-api");
const enka = new EnkaClient({ defaultLanguage: "en" });

run();

async function run() {
    const uid = 825436941;
    /** @type {DetailedGenshinUser} */
    const user = await enka.fetchUser(uid);

    const characters = user.characters;

    if (characters.length === 0) {
        console.log("This user has no detailed characters on the profile.");
        return;
    }

    for (const char of characters) {
        const name = char.characterData.name.get();
        const level = char.level;
        const maxLevel = char.maxLevel;
        const statsList = char.stats.statProperties.map(stats => {
            return ` - ${stats.fightPropName.get()}: ${stats.valueText}`;
        });

        console.log(`${name} - Lv.${level}/${maxLevel}\n${statsList.join("\n")}`);
    }

    enka.close();
}
/* Example output
Hu Tao - Lv.90/90
 - Base HP: 15,552
 - HP: 4,780
 - HP: 116.1%
 - Base ATK: 715
 - ATK: 330
 - ATK: 5.8%
 - Base DEF: 876
 - DEF: 0
 - DEF: 0.0%
 - Movement SPD: 0
 - Movement SPD: 0.0%
 - CRIT Rate: 59.8%
 - CRIT DMG: 229.9%
 - Energy Recharge: 111.0%
 - Healing Bonus: 0.0%
 - Incoming Healing Bonus: 0.0%
 - Elemental Mastery: 254
 - Physical RES: 0.0%
 - Physical DMG Bonus: 0.0%
 - Pyro DMG Bonus: 61.6%
 - Electro DMG Bonus: 0.0%
 - Hydro DMG Bonus: 0.0%
 - Dendro DMG Bonus: 0.0%
 - Anemo DMG Bonus: 0.0%
 - Geo DMG Bonus: 0.0%
 - Cryo DMG Bonus: 0.0%
 - Pyro RES: 0.0%
 - Electro RES: 0.0%
 - Hydro RES: 0.0%
 - Dendro RES: 0.0%
 - Anemo RES: 0.0%
 - Geo RES: 0.0%
 - Cryo RES: 0.0%
 - Pyro DMG Bonus: 61.6%
 - CD Reduction: 0.0%
 - Shield Strength: 0.0%
 - HP: 9,285
 - Max HP: 38,396
 - ATK: 1,394
 - DEF: 876
 - Movement SPD: 0
Raiden Shogun - Lv.90/90
 - Base HP: 12,907
 - HP: 5,079
 - HP: 0.0%
 - Base ATK: 847
 - ATK: 391
 - ATK: 93.2%
 - Base DEF: 789
 - DEF: 72
 - DEF: 0.0%
 - Movement SPD: 0
 - Movement SPD: 0.0%
 - CRIT Rate: 66.8%
 - CRIT DMG: 127.7%
 - Energy Recharge: 280.2%
 - Healing Bonus: 0.0%
 - Incoming Healing Bonus: 0.0%
 - Elemental Mastery: 0
 - Physical RES: 0.0%
 - Physical DMG Bonus: 0.0%
 - Pyro DMG Bonus: 0.0%
 - Electro DMG Bonus: 72.1%
 - Hydro DMG Bonus: 0.0%
 - Dendro DMG Bonus: 0.0%
 - Anemo DMG Bonus: 0.0%
 - Geo DMG Bonus: 0.0%
 - Cryo DMG Bonus: 0.0%
 - Pyro RES: 0.0%
 - Electro RES: 0.0%
 - Hydro RES: 0.0%
 - Dendro RES: 0.0%
 - Anemo RES: 0.0%
 - Geo RES: 0.0%
 - Cryo RES: 0.0%
 - Electro DMG Bonus: 72.1%
 - CD Reduction: 0.0%
 - Shield Strength: 0.0%
 - HP: 6,895
 - Max HP: 17,986
 - ATK: 2,027
 - DEF: 861
 - Movement SPD: 0
Yelan - Lv.90/90
 - Base HP: 14,450
 - HP: 4,780
 - HP: 74.6%
 - Base ATK: 698
 - ATK: 311
 - ATK: 5.2%
 - Base DEF: 548
 - DEF: 0
 - DEF: 6.6%
 - Movement SPD: 0
 - Movement SPD: 0.0%
 - CRIT Rate: 79.0%
 - CRIT DMG: 147.9%
 - Energy Recharge: 240.2%
 - Healing Bonus: 0.0%
 - Incoming Healing Bonus: 0.0%
 - Elemental Mastery: 72
 - Physical RES: 0.0%
 - Physical DMG Bonus: 0.0%
 - Pyro DMG Bonus: 0.0%
 - Electro DMG Bonus: 0.0%
 - Hydro DMG Bonus: 46.6%
 - Dendro DMG Bonus: 0.0%
 - Anemo DMG Bonus: 0.0%
 - Geo DMG Bonus: 0.0%
 - Cryo DMG Bonus: 0.0%
 - Pyro RES: 0.0%
 - Electro RES: 0.0%
 - Hydro RES: 0.0%
 - Dendro RES: 0.0%
 - Anemo RES: 0.0%
 - Geo RES: 0.0%
 - Cryo RES: 0.0%
 - Hydro DMG Bonus: 46.6%
 - CD Reduction: 0.0%
 - Shield Strength: 0.0%
 - HP: 29,009
 - Max HP: 34,342
 - ATK: 1,046
 - DEF: 584
 - Movement SPD: 0
Tartaglia - Lv.90/90
 - Base HP: 13,103
 - HP: 4,780
 - HP: 9.3%
 - Base ATK: 811
 - ATK: 340
 - ATK: 120.5%
 - Base DEF: 815
 - DEF: 39
 - DEF: 19.0%
 - Movement SPD: 0
 - Movement SPD: 0.0%
 - CRIT Rate: 68.0%
 - CRIT DMG: 174.4%
 - Energy Recharge: 105.8%
 - Healing Bonus: 0.0%
 - Incoming Healing Bonus: 0.0%
 - Elemental Mastery: 42
 - Physical RES: 0.0%
 - Physical DMG Bonus: 0.0%
 - Pyro DMG Bonus: 0.0%
 - Electro DMG Bonus: 0.0%
 - Hydro DMG Bonus: 90.4%
 - Dendro DMG Bonus: 0.0%
 - Anemo DMG Bonus: 0.0%
 - Geo DMG Bonus: 0.0%
 - Cryo DMG Bonus: 0.0%
 - Pyro RES: 0.0%
 - Electro RES: 0.0%
 - Hydro RES: 0.0%
 - Dendro RES: 0.0%
 - Anemo RES: 0.0%
 - Geo RES: 0.0%
 - Cryo RES: 0.0%
 - Hydro DMG Bonus: 90.4%
 - CD Reduction: 0.0%
 - Shield Strength: 0.0%
 - HP: 10,690
 - Max HP: 19,106
 - ATK: 2,129
 - DEF: 1,008
 - Movement SPD: 0
Kaedehara Kazuha - Lv.90/90
 - Base HP: 13,348
 - HP: 6,334
 - HP: 23.9%
 - Base ATK: 806
 - ATK: 369
 - ATK: 5.2%
 - Base DEF: 807
 - DEF: 0
 - DEF: 43.7%
 - Movement SPD: 0
 - Movement SPD: 0.0%
 - CRIT Rate: 15.5%
 - CRIT DMG: 92.0%
 - Energy Recharge: 123.3%
 - Healing Bonus: 0.0%
 - Incoming Healing Bonus: 0.0%
 - Elemental Mastery: 957
 - Physical RES: 0.0%
 - Physical DMG Bonus: 0.0%
 - Pyro DMG Bonus: 0.0%
 - Electro DMG Bonus: 0.0%
 - Hydro DMG Bonus: 0.0%
 - Dendro DMG Bonus: 0.0%
 - Anemo DMG Bonus: 15.0%
 - Geo DMG Bonus: 0.0%
 - Cryo DMG Bonus: 0.0%
 - Pyro RES: 0.0%
 - Electro RES: 0.0%
 - Hydro RES: 0.0%
 - Dendro RES: 0.0%
 - Anemo RES: 0.0%
 - Geo RES: 0.0%
 - Cryo RES: 0.0%
 - Anemo DMG Bonus: 15.0%
 - CD Reduction: 0.0%
 - Shield Strength: 0.0%
 - HP: 11,704
 - Max HP: 22,872
 - ATK: 1,218
 - DEF: 1,160
 - Movement SPD: 0
Ganyu - Lv.90/90
 - Base HP: 9,797
 - HP: 5,527
 - HP: 31.5%
 - Base ATK: 943
 - ATK: 325
 - ATK: 123.0%
 - Base DEF: 630
 - DEF: 0
 - DEF: 14.6%
 - Movement SPD: 0
 - Movement SPD: 0.0%
 - CRIT Rate: 47.0%
 - CRIT DMG: 209.6%
 - Energy Recharge: 105.2%
 - Healing Bonus: 0.0%
 - Incoming Healing Bonus: 0.0%
 - Elemental Mastery: 23
 - Physical RES: 0.0%
 - Physical DMG Bonus: 0.0%
 - Pyro DMG Bonus: 0.0%
 - Electro DMG Bonus: 0.0%
 - Hydro DMG Bonus: 0.0%
 - Dendro DMG Bonus: 0.0%
 - Anemo DMG Bonus: 0.0%
 - Geo DMG Bonus: 0.0%
 - Cryo DMG Bonus: 61.6%
 - Pyro RES: 0.0%
 - Electro RES: 0.0%
 - Hydro RES: 0.0%
 - Dendro RES: 0.0%
 - Anemo RES: 0.0%
 - Geo RES: 0.0%
 - Cryo RES: 0.0%
 - Cryo DMG Bonus: 61.6%
 - CD Reduction: 0.0%
 - Shield Strength: 0.0%
 - HP: 16,378
 - Max HP: 18,408
 - ATK: 2,428
 - DEF: 722
 - Movement SPD: 0
Nahida - Lv.90/90
 - Base HP: 10,360
 - HP: 6,065
 - HP: 5.2%
 - Base ATK: 841
 - ATK: 426
 - ATK: 28.6%
 - Base DEF: 630
 - DEF: 23
 - DEF: 0.0%
 - Movement SPD: 0
 - Movement SPD: 0.0%
 - CRIT Rate: 43.1%
 - CRIT DMG: 130.9%
 - Energy Recharge: 105.8%
 - Healing Bonus: 0.0%
 - Incoming Healing Bonus: 0.0%
 - Elemental Mastery: 692
 - Physical RES: 0.0%
 - Physical DMG Bonus: 0.0%
 - Pyro DMG Bonus: 0.0%
 - Electro DMG Bonus: 0.0%
 - Hydro DMG Bonus: 0.0%
 - Dendro DMG Bonus: 61.6%
 - Anemo DMG Bonus: 0.0%
 - Geo DMG Bonus: 0.0%
 - Cryo DMG Bonus: 0.0%
 - Pyro RES: 0.0%
 - Electro RES: 0.0%
 - Hydro RES: 0.0%
 - Dendro RES: 0.0%
 - Anemo RES: 0.0%
 - Geo RES: 0.0%
 - Cryo RES: 0.0%
 - Dendro DMG Bonus: 61.6%
 - CD Reduction: 0.0%
 - Shield Strength: 0.0%
 - HP: 5,866
 - Max HP: 16,969
 - ATK: 1,507
 - DEF: 653
 - Movement SPD: 0
Zhongli - Lv.90/90
 - Base HP: 14,695
 - HP: 7,260
 - HP: 242.3%
 - Base ATK: 606
 - ATK: 399
 - ATK: 32.6%
 - Base DEF: 738
 - DEF: 88
 - DEF: 5.8%
 - Movement SPD: 0
 - Movement SPD: 0.0%
 - CRIT Rate: 18.2%
 - CRIT DMG: 55.4%
 - Energy Recharge: 116.2%
 - Healing Bonus: 0.0%
 - Incoming Healing Bonus: 0.0%
 - Elemental Mastery: 0
 - Physical RES: 0.0%
 - Physical DMG Bonus: 0.0%
 - Pyro DMG Bonus: 0.0%
 - Electro DMG Bonus: 0.0%
 - Hydro DMG Bonus: 0.0%
 - Dendro DMG Bonus: 0.0%
 - Anemo DMG Bonus: 0.0%
 - Geo DMG Bonus: 28.8%
 - Cryo DMG Bonus: 0.0%
 - Pyro RES: 0.0%
 - Electro RES: 0.0%
 - Hydro RES: 0.0%
 - Dendro RES: 0.0%
 - Anemo RES: 0.0%
 - Geo RES: 0.0%
 - Cryo RES: 0.0%
 - Geo DMG Bonus: 28.8%
 - CD Reduction: 0.0%
 - Shield Strength: 0.0%
 - HP: 57,558
 - Max HP: 57,558
 - ATK: 1,202
 - DEF: 869
 - Movement SPD: 0
*/