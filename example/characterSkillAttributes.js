const { EnkaClient } = require("enka-network-api");
const enka = new EnkaClient();

// let's get skill attributes of nahida's elemental burst at level 10.
const nahida = enka.getCharacterById(10000073);

const elementalBurst = nahida.elementalBurst;

// skill attributes at skill level 10
const skillAttributes = elementalBurst.getSkillAttributes(10);

for (const attribute of skillAttributes) {
    const attributeData = attribute.getAttributeData("en");
    console.log(`${attributeData.name} | ${attributeData.valueText}`);
}

/* Example output:
Pyro: DMG Bonus | 1 Character 27%
Pyro: DMG Bonus | 2 Characters 40%
Electro: Trigger Interval Decrease | 1 Character 0.45s
Electro: Trigger Interval Decrease | 2 Characters 0.67s
Hydro: Duration Extension | 1 Character 6.02s
Hydro: Duration Extension | 2 Characters 9.03s
Base Duration | 15.0s
CD | 13.5s
Energy Cost | 50
 */