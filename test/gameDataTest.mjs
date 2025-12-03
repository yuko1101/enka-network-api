import test from "node:test";
import assert from "node:assert";
import { EnkaClient, languages, UpgradableSkill } from "../dist/index.js";
import { separateByValue } from "config_file.js";

const enka = new EnkaClient({ defaultLanguage: "en", cacheDirectory: "./cache" });
const useRawGenshinData = false;
if (!enka.cachedAssetsManager.hasAllContents() || await enka.cachedAssetsManager.checkForUpdates(useRawGenshinData)) {
    await enka.cachedAssetsManager.fetchAllContents({ useRawGenshinData });
    enka.cachedAssetsManager.refreshAllData();
    console.log("Assets updated!");
}

const characters = enka.getAllCharacters();
const weapons = enka.getAllWeapons();
const artifacts = enka.getAllArtifacts();
const materials = enka.getAllMaterials();
const artifactSets = enka.getAllArtifactSets();
const costumes = enka.getAllCostumes();
const nameCards = enka.getAllNameCards();

function showStatistics() {
    console.log("[Excel Statistics]");
    console.log("Characters:", characters.length);
    console.log("Weapons:", weapons.length);
    console.log("Artifacts:", artifacts.length);
    console.log("Materials:", materials.length);
    console.log("Artifact Sets:", artifactSets.length);
    console.log("Costumes:", costumes.length);
    console.log("Name Cards:", nameCards.length);

    console.log();

    console.log("[TextMap Statistics]");
    for (const lang of languages) {
        const map = enka.cachedAssetsManager.getLanguageData(lang);
        console.log(`TextMap ${lang}:`, Object.keys(map).length);
    }

    console.log();
}

showStatistics();

/**
 * @param {import("..").TextAssets} textAssets
 * @param {string} from
 */
const assertValidTextAssets = (textAssets, from = "unknown") => {
    for (const lang of languages) {
        const text = textAssets.getNullable(lang);
        assert.ok(text && text.length > 0, `Text asset ${textAssets.id} (from ${from}) has no text for language ${lang}`);
    }
};

test("Character Names", () => {
    for (const character of characters) {
        assertValidTextAssets(character.name, `Character(${character.id}-${character.skillDepotId}).name`);
    }
});

test("Character NameCards", () => {
    for (const character of characters) {
        const nameCard = character.nameCard;
        if (character.isTraveler || character.isMannequin) {
            assert.strictEqual(nameCard, null, `Traveler/Mannequin character ${character.id}-${character.skillDepotId} has a name card`);
        } else {
            assert.notStrictEqual(nameCard, null, `Non-Traveler/Mannequin character ${character.id}-${character.skillDepotId} has no name card`);
        }
    }
});

test("Character Base Stats", () => {
    for (const character of characters) {
        const baseStats = character.getStats(6, 90);
        assert.ok(baseStats && baseStats.length > 0, `Character ${character.id}-${character.skillDepotId} has no base stats`);
    }
});

test("Character Ascensions", () => {
    for (const character of characters) {
        for (let i = 0; i <= 6; i++) {
            const ascension = character.getAscensionData(i);
            if (i === 0 || character.isMannequin) {
                assert.ok(ascension.cost.coin === 0, `Ascension ${i} of character ${character.id}-${character.skillDepotId} has non-zero coin cost`);
                assert.ok(Object.keys(ascension.cost.items).length === 0, `Ascension ${i} of character ${character.id}-${character.skillDepotId} has materials cost`);
            } else {
                assert.ok(ascension.cost.coin > 0, `Ascension ${i} of character ${character.id}-${character.skillDepotId} has coin cost of 0`);
                assert.ok(Object.keys(ascension.cost.items).length > 0, `Ascension ${i} of character ${character.id}-${character.skillDepotId} has no materials cost`);
            }
        }
    }
});

test("Character Skills", () => {
    for (const character of characters) {
        if (character.isTraveler && character.element === null) {
            continue;
        }

        const skills = character.skills;
        assert.ok(skills && skills.length > 0, `Character ${character.id}-${character.skillDepotId} has no skills`);
        for (const skill of skills) {
            if (!(skill instanceof UpgradableSkill)) continue; // TODO: checks for other skill types
            assertValidTextAssets(skill.name, `Character(${character.id}-${character.skillDepotId}).skills[id=${skill.id}].name`);
            assertValidTextAssets(skill.description, `Character(${character.id}-${character.skillDepotId}).skills[id=${skill.id}].description`);


            const levelUpCost = skill.getUpgradeCost(10);
            assert.notStrictEqual(levelUpCost, null, `Skill ${skill.id} of character ${character.id}-${character.skillDepotId} has no level up cost`);
            assert.ok(levelUpCost.coin > 0, `Skill ${skill.id} of character ${character.id}-${character.skillDepotId} has coin cost of 0`);
            assert.ok(Object.keys(levelUpCost.items).length > 0, `Skill ${skill.id} of character ${character.id}-${character.skillDepotId} has no materials cost`);
        }
    }
});

test("Character PassiveTalents", () => {
    for (const character of characters) {
        if (character.isTraveler && character.element === null) {
            continue;
        }

        const passiveTalents = character.passiveTalents;
        assert.ok(passiveTalents && passiveTalents.length > 0, `Character ${character.id}-${character.skillDepotId} has no passive talents`);
        for (const passiveTalent of passiveTalents) {
            if (passiveTalent.isHidden) continue;
            assertValidTextAssets(passiveTalent.name, `Character(${character.id}-${character.skillDepotId}).passiveTalents[id=${passiveTalent.id}].name`);
            assertValidTextAssets(passiveTalent.description, `Character(${character.id}-${character.skillDepotId}).passiveTalents[id=${passiveTalent.id}].description`);
        }
    }
});

test("Weapon Names", () => {
    for (const weapon of weapons) {
        assertValidTextAssets(weapon.name, `Weapon(${weapon.id}).name`);
    }
});

test("Weapon Base Stats", () => {
    for (const weapon of weapons) {
        const baseStats = weapon.getStats(1, 1);
        assert.ok(baseStats && baseStats.length > 0, `Weapon ${weapon.id} has no base stats`);
    }
});

test("Weapon Ascensions", () => {
    for (const weapon of weapons) {
        const maxAscension = weapon.stars >= 3 ? 6 : 4;
        for (let i = 0; i <= maxAscension; i++) {
            const ascension = weapon.getAscensionData(i);
            if (i === 0) {
                assert.ok(ascension.cost.coin === 0, `Ascension ${i} of weapon ${weapon.id} has non-zero coin cost`);
                assert.ok(Object.keys(ascension.cost.items).length === 0, `Ascension ${i} of weapon ${weapon.id} has materials cost`);
            } else {
                assert.ok(ascension.cost.coin > 0 || weapon.stars === 1, `Ascension ${i} of weapon ${weapon.id} has coin cost of 0`);
                assert.ok(Object.keys(ascension.cost.items).length > 0, `Ascension ${i} of weapon ${weapon.id} has no materials cost`);
            }
        }
    }
});

test("Artifact Names", () => {
    for (const artifact of artifacts) {
        assertValidTextAssets(artifact.name, `Artifact(${artifact.id}).name`);
    }
});

test("Artifact Set Names", () => {
    for (const artifactSet of artifactSets) {
        assertValidTextAssets(artifactSet.name, `ArtifactSet(${artifactSet.id}).name`);
    }
});

test("Artifact Set Bonuses", () => {
    for (const artifactSet of artifactSets) {
        const bonuses = artifactSet.setBonus;
        assert.ok(bonuses && bonuses.length > 0, `Artifact set ${artifactSet.id} has no bonuses`);
        for (const bonus of bonuses) {
            assert.ok(bonus.needCount > 0, `Artifact set ${artifactSet.id} has bonus with no needCount`);
            assertValidTextAssets(bonus.description, `ArtifactSet(${artifactSet.id}).setBonus[needCount=${bonus.needCount}].description`);
        }
    }
});

test("Costume Names", () => {
    for (const costume of costumes) {
        assertValidTextAssets(costume.name, `Costume(${costume.id}).name`);
    }
});

test("Costume Characters", () => {
    for (const costume of costumes) {
        const character = characters.find(c => c.id === costume.characterId);
        assert.notStrictEqual(character, null, `Costume ${costume.id} has no character`);
    }
});

test("Costume Duplicated Defaults", () => {
    const grouped = separateByValue(costumes, c => c.characterId);
    for (const [characterId, costumes] of Object.entries(grouped)) {
        if (costumes.length > 1) {
            const defaultCostumes = costumes.filter(c => c.isDefault);
            assert.strictEqual(defaultCostumes.length, 1, `Character ${characterId} has multiple default costumes`);
        }
    }
});

test("NameCard Names", () => {
    for (const nameCard of nameCards) {
        assertValidTextAssets(nameCard.name, `NameCard(${nameCard.id}).name`);
    }
});

test("NameCard Descriptions", () => {
    for (const nameCard of nameCards) {
        assertValidTextAssets(nameCard.description, `NameCard(${nameCard.id}).description`);
    }
});

test("NameCard Icons", () => {
    for (const nameCard of nameCards) {
        assert.ok(nameCard.icon.isAvailable, `NameCard ${nameCard.id} has no icon`);
    }
});

test("NameCard Pictures", () => {
    for (const nameCard of nameCards) {
        assert.ok(nameCard.pictures && nameCard.pictures.length > 0, `NameCard ${nameCard.id} has no images`);
    }
});
