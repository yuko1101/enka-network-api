const { EnkaClient } = require("enka-network-api");
const enka = new EnkaClient({ defaultLanguage: "en" });

run();

async function run() {
    const uid = 825436941;
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
        const statsList = char.status.statusProperties.map(stats => {
            const value = stats.value * (stats.isPercent ? 100 : 1); // or just use stats.getFormattedValue()
            const fixed = stats.isPercent ? 1 : 0; // To what decimal place
            const suffix = stats.isPercent ? "%" : "";
            return `- ${stats.fightPropName.get()}: ${value.toFixed(fixed)}${suffix}`;
        });

        console.log(`
            ${name} - Lv.${level}/${maxLevel}
            ${statsList.join("\n")}
        `.trim().split("\n").map(line => line.trim()).join("\n"));
    }

    enka.close();
}
/* Example output
Hu Tao - Lv.90/90
- Base HP: 15552
- HP: 5736
- HP: 49.7%
- Base ATK: 715
- ATK: 330
- ATK: 11.7%
- Base DEF: 876
- DEF: 0
- DEF: 0.0%
- Movement SPD: 0
- Movement SPD: 0.0%
- CRIT Rate: 74.6%
- CRIT DMG: 208.2%
- Energy Recharge: 129.8%
- Healing Bonus: 0.0%
- Incoming Healing Bonus: 0.0%
- Elemental Mastery: 294
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
- CD Reduction: 0.0%
- Shield Strength: 0.0%
- HP: 12312
- Max HP: 29022
- ATK: 1360
- DEF: 876
- Movement SPD: 0
Raiden Shogun - Lv.90/90
- Base HP: 12907
- HP: 5079
- HP: 0.0%
- Base ATK: 847
- ATK: 389
- ATK: 72.9%
- Base DEF: 789
- DEF: 53
- DEF: 0.0%
- Movement SPD: 0
- Movement SPD: 0.0%
- CRIT Rate: 62.1%
- CRIT DMG: 133.9%
- Energy Recharge: 291.2%
- Healing Bonus: 0.0%
- Incoming Healing Bonus: 0.0%
- Elemental Mastery: 44
- Physical RES: 0.0%
- Physical DMG Bonus: 0.0%
- Pyro DMG Bonus: 0.0%
- Electro DMG Bonus: 76.5%
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
- CD Reduction: 0.0%
- Shield Strength: 0.0%
- HP: 6705
- Max HP: 17986
- ATK: 1853
- DEF: 843
- Movement SPD: 0
Xiangling - Lv.80/80
- Base HP: 9638
- HP: 5079
- HP: 5.2%
- Base ATK: 874
- ATK: 379
- ATK: 41.4%
- Base DEF: 593
- DEF: 37
- DEF: 15.3%
- Movement SPD: 0
- Movement SPD: 0.0%
- CRIT Rate: 65.9%
- CRIT DMG: 104.4%
- Energy Recharge: 231.2%
- Healing Bonus: 0.0%
- Incoming Healing Bonus: 0.0%
- Elemental Mastery: 142
- Physical RES: 0.0%
- Physical DMG Bonus: 0.0%
- Pyro DMG Bonus: 46.6%
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
- CD Reduction: 0.0%
- Shield Strength: 0.0%
- HP: 8646
- Max HP: 15223
- ATK: 1615
- DEF: 721
- Movement SPD: 0
Diona - Lv.90/90
- Base HP: 9570
- HP: 6931
- HP: 169.7%
- Base ATK: 709
- ATK: 327
- ATK: 9.3%
- Base DEF: 601
- DEF: 162
- DEF: 35.7%
- Movement SPD: 0
- Movement SPD: 0.0%
- CRIT Rate: 23.7%
- CRIT DMG: 57.0%
- Energy Recharge: 151.9%
- Healing Bonus: 0.0%
- Incoming Healing Bonus: 0.0%
- Elemental Mastery: 105
- Physical RES: 0.0%
- Physical DMG Bonus: 0.0%
- Pyro DMG Bonus: 0.0%
- Electro DMG Bonus: 0.0%
- Hydro DMG Bonus: 0.0%
- Dendro DMG Bonus: 0.0%
- Anemo DMG Bonus: 0.0%
- Geo DMG Bonus: 0.0%
- Cryo DMG Bonus: 24.0%
- Pyro RES: 0.0%
- Electro RES: 0.0%
- Hydro RES: 0.0%
- Dendro RES: 0.0%
- Anemo RES: 0.0%
- Geo RES: 0.0%
- Cryo RES: 0.0%
- CD Reduction: 0.0%
- Shield Strength: 0.0%
- HP: 32742
- Max HP: 32742
- ATK: 1102
- DEF: 977
- Movement SPD: 0
*/