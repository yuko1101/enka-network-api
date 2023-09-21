const { EnkaClient, DetailedGenshinUser, ArtifactSet } = require("enka-network-api");
const enka = new EnkaClient();

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

    // get artifacts stats and set bonuses from this character.
    const target = characters[0];
    const artifacts = target.artifacts;

    // let's calculate crit value, or CV, by [crit rate] * 2 + [crit damage]

    // this is a map specifying multipliers for each stats.
    // list of stat types can be found in https://enka-network-api.vercel.app/docs/api/FightProp
    const multipliers = {
        // Crit Rate
        "FIGHT_PROP_CRITICAL": 2,
        // Crit DMG
        "FIGHT_PROP_CRITICAL_HURT": 1
    }

    // get mainstats of equipped 5 pieces.
    // actually this may be not clever since circlets are the only artifacts that can have CV in mainstats
    // but get CV from all mainstats in this example just in case.
    const mainstats = artifacts.map(a => a.mainstat);

    // get substats of equipped 5 pieces.
    const substats = artifacts.flatMap(a => a.substats.total);

    // calculate CV
    const cv = [...mainstats, ...substats]
        .filter(stat => Object.keys(multipliers).includes(stat.fightProp))
        .map(stat => stat.getMultipliedValue() * multipliers[stat.fightProp])
        .reduce((a, b) => a + b);

    console.log(`${target.characterData.name.get("en")}: ${cv.toFixed(1)} CV`);

    // Example output: 
    // Hu Tao: 185.0 CV




    // get artifact set bonuses
    const setBonuses = ArtifactSet.getActiveSetBonus(artifacts);
    console.log(setBonuses);

    const activeBonuses = setBonuses
        .filter(set => set.activeBonus.length > 0)
        .flatMap(set => set.activeBonus);

    console.log(`[Active Set Bonuses]\n${activeBonuses.map(bonus => bonus.description.get()).join("\n")}`)

    /* Example output:
    [Active Set Bonuses]
    Pyro DMG Bonus +15%
    Increases Overloaded, Burning, and Burgeon DMG by 40%. Increases Vaporize and Melt DMG by 15%. Using Elemental Skill increases the 2-Piece Set Bonus by 50% of its starting value for 10s. Max 3 stacks.
     */
}