// Let's get ascension costs and upgrade costs of a character and a weapon.
// In this example, we only calculate costs for character ascensions,
// but other costs (such as talent upgrade costs and weapon upgrade costs) can be calculated
// by the same way.

const { EnkaClient, Material } = require("enka-network-api");
const enka = new EnkaClient();

// calculate ascension costs for Xiao

const xiao = enka.getCharacterById(10000026);

const ascensions = [];
// ascension 0 (max character level is 20) is already unlocked.
for (let i = 1; i <= 6; i++) {
    ascensions.push(xiao.getAscensionData(i));
}

const costs = ascensions.map(a => a.cost);

// Mora cost
const coins = costs.map(cost => cost.coin).reduce((a, b) => a + b);

/** @type {{[materialId: string]: { material: Material, count: number }}} */
const materialsMap = costs
    .map(cost => cost.items)
    .reduce((materialsMap, items) => {
        for (const item of items) {
            materialsMap[item.material.id] ??= { material: item.material, count: 0 };
            materialsMap[item.material.id].count += item.count;
        }
        return materialsMap;
    }, {});

const materials = Object.values(materialsMap);

console.log(`<Coins> ${coins} mora\n<Materials> ${materials.map(m => `${m.material.name.get()}: ${m.count}`).join(", ")}`);
/* Example output (<Coins> does not include coins used for character level-up):
<Coins> 420000 mora
<Materials> Qingxin: 168, Vayuda Turquoise Sliver: 1, Vayuda Turquoise Fragment: 9, Vayuda Turquoise Chunk: 9, Vayuda Turquoise Gemstone: 6, Slime Condensate: 18, Slime Secretions: 30, Slime Concentrate: 36, Juvenile Jade: 46
 */