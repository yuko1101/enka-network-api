const { EnkaClient } = require("enka-network-api");
const enka = new EnkaClient({ defaultLanguage: "en" });

const weapons = enka.getAllWeapons();

for (const weapon of weapons) {
    const name = weapon.name.get();
    const stars = weapon.stars;

    const refinement = weapon.refinements[0];
    const refinementName = refinement ? refinement.name.get() : "No refinements";
    const refinementDesc = refinement ? refinement.description.get().replace(/\<[^\>]+\>/g, "") : "No information";

    console.log(`${name} (★${stars}) > ${refinementName}: ${refinementDesc}`);
}

/* Example output
Dull Blade (★1) > No refinements: No information
Silver Sword (★2) > No refinements: No information
Cool Steel (★3) > Bane of Water and Ice: Increases DMG against opponents affected by Hydro or Cryo by 12%.
Harbinger of Dawn (★3) > Vigorous: When HP is above 90%, increases CRIT Rate by 14%.
Traveler's Handy Sword (★3) > Journey: Each Elemental Orb or Particle collected restores 1% HP.
Dark Iron Sword (★3) > Overloaded: Upon causing an Overloaded, Superconduct, Electro-Charged, Quicken, Aggravate, Hyperbloom, or Electro-infused Swirl reaction, ATK is increased by 20% for 12s.
Fillet Blade (★3) > Gash: On hit, has a 50% chance to deal 240% ATK DMG to a single opponent. Can only occur once every 15s.
Skyrider Sword (★3) > Determination: Using an Elemental Burst grants a 12% increase in ATK and Movement SPD for 15s.
Favonius Sword (★4) > Windfall: CRIT Hits have a 60% chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy for the character. Can only occur once every 12s.
The Flute (★4) > Chord: Normal or Charged Attacks grant a Harmonic on hits. Gaining 5 Harmonics triggers the power of music and deals 100% ATK DMG to surrounding opponents. Harmonics last up to 30s, and a maximum of 1 can be gained every 0.5s.
Sacrificial Sword (★4) > Composed: After damaging an opponent with an Elemental Skill, the skill has a 40% chance to end its own CD. Can only occur once every 30s.
Royal Longsword (★4) > Focus: Upon damaging an opponent, increases CRIT Rate by 8%. Max 5 stacks. A CRIT Hit removes all stacks.
Lion's Roar (★4) > Bane of Fire and Thunder: Increases DMG against opponents affected by Pyro or Electro by 20%.
Prototype Rancour (★4) > Smashed Stone: On hit, Normal or Charged Attacks increase ATK and DEF by 4% for 6s. Max 4 stacks. This effect can only occur once every 0.3s.
Iron Sting (★4) > Infusion Stinger: Dealing Elemental DMG increases all DMG by 6% for 6s. Max 2 stacks. Can occur once every 1s.
Blackcliff Longsword (★4) > Press the Advantage: After defeating an opponent, ATK is increased by 12% for 30s. This effect has a maximum of 3 stacks, and the duration of each stack is independent of the others.
The Black Sword (★4) > Justice: Increases DMG dealt by Normal and Charged Attacks by 20%. Additionally, regenerates 60% of ATK as HP when Normal and Charged Attacks score a CRIT Hit. This effect can occur once every 5s.
The Alley Flash (★4) > Itinerant Hero: Increases DMG dealt by the character equipping this weapon by 12%. Taking DMG disables this effect for 5s.
Sword of Descension (★4) > Descension: Effective only on the following platform: \n"PlayStation Network"\nHitting opponents with Normal and Charged Attacks grants a 50% chance to deal 200% ATK as DMG in a small AoE. This effect can only occur once every 10s. Additionally, if the Traveler equips the Sword of Descension, their ATK is increased by 66.
Festering Desire (★4) > Undying Admiration: Increases Elemental Skill DMG by 16% and Elemental Skill CRIT Rate by 6%.
Amenoma Kageuchi (★4) > Iwakura Succession: After casting an Elemental Skill, gain 1 Succession Seed. This effect can be triggered once every 5s. The Succession Seed lasts for 30s. Up to 3 Succession Seeds may exist simultaneously. After using an Elemental Burst, all Succession Seeds are consumed and after 2s, the character regenerates 6 Energy for each seed consumed.
Cinnabar Spindle (★4) > Spotless Heart: Elemental Skill DMG is increased by 40% of DEF. The effect will be triggered no more than once every 1.5s and will be cleared 0.1s after the Elemental Skill deals DMG.
Kagotsurube Isshin (★4) > Isshin Art Clarity: When a Normal, Charged, or Plunging Attack hits an opponent, it will whip up a Hewing Gale, dealing AoE DMG equal to 180% of ATK and increasing ATK by 15% for 8s. This effect can be triggered once every 8s.
Sapwood Blade (★4) > Forest Sanctuary: After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of Consciousness will be created around the character for a maximum of 10s. When picked up, the Leaf will grant the character 60 Elemental Mastery for 12s. Only 1 Leaf can be generated this way every 20s. This effect can still be triggered if the character is not on the field. The Leaf of Consciousness' effect cannot stack.
Xiphos' Moonlight (★4) > Jinni's Whisper: The following effect will trigger every 10s: The equipping character will gain 0.036% Energy Recharge for each point of Elemental Mastery they possess for 12s, with nearby party members gaining 30% of this buff for the same duration. Multiple instances of this weapon can allow this buff to stack. This effect will still trigger even if the character is not on the field.
Prized Isshin Blade (★4) > Wandering Striker: When a Normal, Charged, or Plunging Attack hits an opponent, it will release an Accursed Spirit, dealing AoE DMG equal to 180% of ATK and restoring 100% of ATK as HP. This effect can be triggered once every 8s. The DMG done by this weapon's wielder is decreased by 50%.
Prized Isshin Blade (★4) > Wandering Striker: When a Normal, Charged, or Plunging Attack hits an opponent, it will release an Accursed Spirit, dealing AoE DMG equal to 180% of ATK. This effect can be triggered once every 8s. The DMG done by this weapon's wielder is decreased by 50%.
Prized Isshin Blade (★4) > Wandering Striker: When a Normal, Charged, or Plunging Attack hits an opponent, it will release an Accursed Spirit, dealing AoE DMG equal to 180% of ATK and restoring 100% of ATK as HP. This effect can be triggered once every 8s. The DMG done by this weapon's wielder is decreased by 50%.
Toukabou Shigure (★4) > Kaidan: Rainfall Earthbinder: After an attack hits opponents, it will inflict an instance of Cursed Parasol upon one of them for 10s. This effect can be triggered once every 15s. If this opponent is taken out during Cursed Parasol's duration, Cursed Parasol's CD will be refreshed immediately. The character wielding this weapon will deal 16% more DMG to the opponent affected by Cursed Parasol.
Aquila Favonia (★5) > Falcon's Defiance: ATK is increased by 20%. Triggers on taking DMG: the soul of the Falcon of the West awakens, holding the banner of resistance aloft, regenerating HP equal to 100% of ATK and dealing 200% of ATK as DMG to surrounding opponents. This effect can only occur once every 15s.
Skyward Blade (★5) > Sky-Piercing Fang: CRIT Rate increased by 4%. Gains Skypiercing Might upon using an Elemental Burst: Increases Movement SPD by 10%, increases ATK SPD by 10%, and Normal and Charged hits deal additional DMG equal to 20% of ATK. Skypiercing Might lasts for 12s.
Freedom-Sworn (★5) > Revolutionary Chorale: A part of the "Millennial Movement" that wanders amidst the winds. Increases DMG by 10%. When the character wielding this weapon triggers Elemental Reactions, they gain a Sigil of Rebellion. This effect can be triggered once every 0.5s and can be triggered even if said character is not on the field. When you possess 2 Sigils of Rebellion, all of them will be consumed and all nearby party members will obtain "Millennial Movement: Song of Resistance" for 12s. "Millennial Movement: Song of Resistance" increases Normal, Charged and Plunging Attack DMG by 16% and increases ATK by 20%. Once this effect is triggered, you will not gain Sigils of Rebellion for 20s. Of the many effects of the "Millennial Movement," buffs of the same type will not stack.
Summit Shaper (★5) > Golden Majesty: Increases Shield Strength by 20%. Scoring hits on opponents increases ATK by 4% for 8s. Max 5 stacks. Can only occur once every 0.3s. While protected by a shield, this ATK increase effect is increased by 100%.
Primordial Jade Cutter (★5) > Protector's Virtue: HP increased by 20%. Additionally, provides an ATK Bonus based on 1.2% of the wielder's Max HP.
Mistsplitter Reforged (★5) > Mistsplitter's Edge: Gain a 12% Elemental DMG Bonus for all elements and receive the might of the Mistsplitter's Emblem. At stack levels 1/2/3, the Mistsplitter's Emblem provides a 8/16/28% Elemental DMG Bonus for the character's Elemental Type. The character will obtain 1 stack of Mistsplitter's Emblem in each of the following scenarios: Normal Attack deals Elemental DMG (stack lasts 5s), casting Elemental Burst (stack lasts 10s); Energy is less than 100% (stack disappears when Energy is full). Each stack's duration is calculated independently.
Haran Geppaku Futsu (★5) > Honed Flow: Obtain 12% All Elemental DMG Bonus. When other nearby party members use Elemental Skills, the character equipping this weapon will gain 1 Wavespike stack. Max 2 stacks. This effect can be triggered once every 0.3s. When the character equipping this weapon uses an Elemental Skill, all stacks of Wavespike will be consumed to gain Rippling Upheaval: each stack of Wavespike consumed will increase Normal Attack DMG by 20% for 8s. 
Key of Khaj-Nisut (★5) > Sunken Song of the Sands: HP increased by 20%. When an Elemental Skill hits opponents, you gain the Grand Hymn effect for 20s. This effect increases the equipping character's Elemental Mastery by 0.12% of their Max HP. This effect can trigger once every 0.3s. Max 3 stacks. When this effect gains 3 stacks, or when the third stack's duration is refreshed, the Elemental Mastery of all nearby party members will be increased by 0.2% of the equipping character's max HP for 20s.
Waster Greatsword (★1) > No refinements: No information
Old Merc's Pal (★2) > No refinements: No information
Ferrous Shadow (★3) > Unbending: When HP falls below 70%, increases Charged Attack DMG by 30% and Charged Attacks become harder to interrupt.
Bloodtainted Greatsword (★3) > Bane of Fire and Thunder: Increases DMG dealt against opponents affected by Pyro or Electro by 12%.
White Iron Greatsword (★3) > Cull the Weak: Defeating an opponent restores 8% HP.
Quartz (★3) > Residual Heat: Upon causing an Overloaded, Melt, Burning, Vaporize, Burgeon, or a Pyro-infused Swirl reaction, ATK is increased by 20% for 12s.
Debate Club (★3) > Blunt Conclusion: After using an Elemental Skill, on hit, Normal and Charged Attacks deal additional DMG equal to 60% of ATK in a small AoE. Effect lasts 15s. DMG can only occur once every 3s.
Skyrider Greatsword (★3) > Courage: On hit, Normal or Charged Attacks increase ATK by 6% for 6s. Max 4 stacks. Can occur once every 0.5s.
Favonius Greatsword (★4) > Windfall: CRIT Hits have a 60% chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy for the character. Can only occur once every 12s.
The Bell (★4) > Rebellious Guardian: Taking DMG generates a shield which absorbs DMG up to 20% of Max HP. This shield lasts for 10s or until broken, and can only be triggered once every 45s. While protected by a shield, the character 
gains 12% increased DMG.
Sacrificial Greatsword (★4) > Composed: After damaging an opponent with an Elemental Skill, the skill has a 40% chance to end its own CD. Can only occur once every 30s.
Royal Greatsword (★4) > Focus: Upon damaging an opponent, increases CRIT Rate by 8%. Max 5 stacks. A CRIT Hit removes all stacks.
Rainslasher (★4) > Bane of Storm and Tide: Increases DMG against opponents affected by Hydro or Electro by 20%.
Prototype Archaic (★4) > Crush: On hit, Normal or Charged Attacks have a 50% chance to deal an additional 240% ATK DMG to opponents within a small AoE. Can only occur once every 15s.
Whiteblind (★4) > Infusion Blade: On hit, Normal or Charged Attacks increase ATK and DEF by 6% for 6s. Max 4 stacks. This effect can only occur once every 0.5s.
Blackcliff Slasher (★4) > Press the Advantage: After defeating an opponent, ATK is increased by 12% for 30s. This effect has a maximum of 3 stacks, and the duration of each stack is independent of the others.
Serpent Spine (★4) > Wavesplitter: Every 4s a character is on the field, they will deal 6% more DMG and take 3% more DMG. This effect has a maximum of 5 stacks and will not be reset if the character leaves the field, but will be reduced by 1 stack when the character takes DMG.
Lithic Blade (★4) > Lithic Axiom: Unity: For every character in the party who hails from Liyue, the character who equips this weapon gains a 7% ATK increase and a 3% CRIT Rate increase. This effect stacks up to 4 times.
Snow-Tombed Starsilver (★4) > Frost Burial: Hitting an opponent with Normal and Charged Attacks has a 60% chance of forming and dropping an Everfrost Icicle above them, dealing AoE DMG equal to 80% of ATK. Opponents affected by Cryo are instead dealt DMG equal to 200% of ATK. Can only occur once every 10s.
Luxurious Sea-Lord (★4) > Oceanic Victory: Increases Elemental Burst DMG by 12%. When Elemental Burst hits opponents, there is a 100% chance of summoning a huge onrush of tuna that deals 100% ATK as AoE DMG. This effect can occur once every 15s.
Katsuragikiri Nagamasa (★4) > Samurai Conduct: Increases Elemental Skill DMG by 6%. After Elemental Skill hits an opponent, the character loses 3 Energy but regenerates 3 Energy every 2s for the next 6s. This effect can occur once every 10s. Can be triggered even when the character is not on the field.
Makhaira Aquamarine (★4) > Desert Pavilion: The following effect will trigger every 10s: The equipping character will gain 24% of their Elemental Mastery as bonus ATK for 12s, with nearby party members gaining 30% of this buff for the same duration. Multiple instances of this weapon can allow this buff to stack. This effect will still trigger even if the character is not on the field.
Akuoumaru (★4) > Watatsumi Wavewalker: For every point of the entire party's combined maximum Energy capacity, the Elemental Burst DMG of the character equipping this weapon is increased by 0.12%. A maximum of 40% increased Elemental 
Burst DMG can be achieved this way.
Forest Regalia (★4) > Forest Sanctuary: After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of Consciousness will be created around the character for a maximum of 10s. When picked up, the Leaf will grant the character 60 Elemental Mastery for 12s. Only 1 Leaf can be generated this way every 20s. This effect can still be triggered if the character is not on the field. The Leaf of Consciousness' effect cannot stack.
Skyward Pride (★5) > Sky-ripping Dragon Spine: Increases all DMG by 8%. After using an Elemental Burst, Normal or Charged Attack, on hit, creates a vacuum blade that does 80% of ATK as DMG to opponents along its path. Lasts for 20s or 8 vacuum blades.
Wolf's Gravestone (★5) > Wolfish Tracker: Increases ATK by 20%. On hit, attacks against opponents with less than 30% HP increase all party members' ATK by 40% for 12s. Can only occur once every 30s.
Song of Broken Pines (★5) > Rebel's Banner-Hymn: A part of the "Millennial Movement" that wanders amidst the winds. Increases ATK by 16%, and when Normal or Charged Attacks hit opponents, the character gains a Sigil of Whispers. This 
effect can be triggered once every 0.3s. When you possess 4 Sigils of Whispers, all of them will be consumed and all nearby party members will obtain the "Millennial Movement: Banner-Hymn" effect for 12s. "Millennial Movement: Banner-Hymn" increases Normal ATK SPD by 12% and increases ATK by 20%. Once this effect is triggered, you will not gain Sigils of Whispers for 20s. Of the many effects of the "Millennial Movement," buffs of the same type will not stack.     
The Unforged (★5) > Golden Majesty: Increases Shield Strength by 20%. Scoring hits on opponents increases ATK by 4% for 8s. Max 5 stacks. Can only occur once every 0.3s. While protected by a shield, this ATK increase effect is increased by 100%.
Redhorn Stonethresher (★5) > Gokadaiou Otogibanashi: DEF is increased by 28%. Normal and Charged Attack DMG is increased by 40% of DEF.
Beginner's Protector (★1) > No refinements: No information
Iron Point (★2) > No refinements: No information
White Tassel (★3) > Sharp: Increases Normal Attack DMG by 24%.
Halberd (★3) > Heavy: Normal Attacks deal an additional 160% ATK as DMG. Can only occur once every 10s.
Black Tassel (★3) > Bane of the Soft: Increases DMG against slimes by 40%.
The Flagstaff (★3) > TBD: Defeating an opponent restores 8% HP.
Dragon's Bane (★4) > Bane of Flame and Water: Increases DMG against opponents affected by Hydro or Pyro by 20%.
Prototype Starglitter (★4) > Magic Affinity: After using an Elemental Skill, increases Normal and Charged Attack DMG by 8% for 12s. Max 2 stacks.
Crescent Pike (★4) > Infusion Needle: After picking up an Elemental Orb/Particle, Normal and Charged Attacks deal additional DMG equal to 20% of ATK for 5s.
Blackcliff Pole (★4) > Press the Advantage: After defeating an enemy, ATK is increased by 12% for 30s. This effect has a maximum of 3 stacks, and the duration of each stack is independent of the others.
Deathmatch (★4) > Gladiator: If there are at least 2 opponents nearby, ATK is increased by 16% and DEF is increased by 16%. If there are fewer than 2 opponents nearby, ATK is increased by 24%.
Lithic Spear (★4) > Lithic Axiom: Unity: For every character in the party who hails from Liyue, the character who equips this weapon gains a 7% ATK increase and a 3% CRIT Rate increase. This effect stacks up to 4 times.
Favonius Lance (★4) > Windfall: CRIT Hits have a 60% chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy for the character. Can only occur once every 12s.
Royal Spear (★4) > Focus: Upon damaging an opponent, increases CRIT Rate by 8%. Max 5 stacks. A CRIT Hit removes all stacks.
Dragonspine Spear (★4) > Frost Burial: Hitting an opponent with Normal and Charged Attacks has a 60% chance of forming and dropping an Everfrost Icicle above them, dealing AoE DMG equal to 80% of ATK. Opponents affected by Cryo are instead dealt DMG equal to 200% of ATK. Can only occur once every 10s.
Kitain Cross Spear (★4) > Samurai Conduct: Increases Elemental Skill DMG by 6%. After Elemental Skill hits an opponent, the character loses 3 Energy but regenerates 3 Energy every 2s for the next 6s. This effect can occur once every 10s. Can be triggered even when the character is not on the field.
"The Catch" (★4) > Shanty: Increases Elemental Burst DMG by 16% and Elemental Burst CRIT Rate by 6%.
Wavebreaker's Fin (★4) > Watatsumi Wavewalker: For every point of the entire party's combined maximum Energy capacity, the Elemental Burst DMG of the character equipping this weapon is increased by 0.12%. A maximum of 40% increased Elemental Burst DMG can be achieved this way.
Moonpiercer (★4) > Stillwood Moonshadow: After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of Revival will be created around the character for a maximum of 10s. When picked up, the Leaf will grant the character 16% ATK for 12s. Only 1 Leaf can be generated this way every 20s. This effect can still be triggered if the character is not on the field.
Missive Windspear (★4) > The Wind Unattained: Within 10s after an Elemental Reaction is triggered, ATK is increased by 12% and Elemental Mastery is increased by 48.
Staff of Homa (★5) > Reckless Cinnabar: HP increased by 20%. Additionally, provides an ATK Bonus based on 0.8% of the wielder's Max HP. When the wielder's HP is less than 50%, this ATK Bonus is increased by an additional 1% of Max HP.Skyward Spine (★5) > Black Wing: Increases CRIT Rate by 8% and increases Normal ATK SPD by 12%. Additionally, Normal and Charged Attacks hits on opponents have a 50% chance to trigger a vacuum blade that deals 40% of ATK as DMG in a small AoE. This effect can occur no more than once every 2s.
Vortex Vanquisher (★5) > Golden Majesty: Increases Shield Strength by 20%. Scoring hits on opponents increases ATK by 4% for 8s. Max 5 stacks. Can only occur once every 0.3s. While protected by a shield, this ATK increase effect is increased by 100%.
Primordial Jade Winged-Spear (★5) > Eagle Spear of Justice: On hit, increases ATK by 3.2% for 6s. Max 7 stacks. This effect can only occur once every 0.3s. While in possession of the maximum possible stacks, DMG dealt is increased by 
12%.
Calamity Queller (★5) > Extinguishing Precept: Gain 12% All Elemental DMG Bonus. Obtain Consummation for 20s after using an Elemental Skill, causing ATK to increase by 3.2% per second. This ATK increase has a maximum of 6 stacks. When the character equipped with this weapon is not on the field, Consummation's ATK increase is doubled.
Engulfing Lightning (★5) > Timeless Dream: Eternal Stove: ATK increased by 28% of Energy Recharge over the base 100%. You can gain a maximum bonus of 80% ATK. Gain 30% Energy Recharge for 12s after using an Elemental Burst.
Staff of the Scarlet Sands (★5) > Heat Haze at Horizon's End: The equipping character gains 52% of their Elemental Mastery as bonus ATK. When an Elemental Skill hits opponents, the Dream of the Scarlet Sands effect will be gained for 
10s: The equipping character will gain 28% of their Elemental Mastery as bonus ATK. Max 3 stacks.
Apprentice's Notes (★1) > No refinements: No information
Pocket Grimoire (★2) > No refinements: No information
Magic Guide (★3) > Bane of Storm and Tide: Increases DMG against opponents affected by Hydro or Electro by 12%.
Thrilling Tales of Dragon Slayers (★3) > Heritage: When switching characters, the new character taking the field has their ATK increased by 24% for 10s. This effect can only occur once every 20s.
Otherworldly Story (★3) > Energy Shower: Picking up an Elemental Energy Orb/Particle recovers 1% HP.
Emerald Orb (★3) > Rapids: Upon causing a Vaporize, Electro-Charged, Frozen, Bloom, or a Hydro-infused Swirl reaction, increases ATK by 20% for 12s.
Twin Nephrite (★3) > Guerilla Tactics: Defeating an opponent increases Movement SPD and ATK by 12% for 15s.
Amber Bead (★3) > Elemental Mastery: Normal Attack hits increase all Elemental DMG by 6% for 6s. Max 2 stacks.
Favonius Codex (★4) > Windfall: CRIT Hits have a 60% chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy for the character. Can only occur once every 12s.
The Widsith (★4) > Debut: When the character takes the field, they will gain a random theme song for 10s. This can only occur once every 30s. Recitative: ATK is increased by 60%. Aria: Increases all Elemental DMG by 48%. Interlude: Elemental Mastery is increased by 240.
Sacrificial Fragments (★4) > Composed: After damaging an opponent with an Elemental Skill, the skill has a 40% chance to end its own CD. Can only occur once every 30s.
Royal Grimoire (★4) > Focus: Upon damaging an opponent, increases CRIT Rate by 8%. Max 5 stacks. A CRIT Hit removes all stacks.
Solar Pearl (★4) > Solar Shine: Normal Attack hits increase Elemental Skill and Elemental Burst DMG by 20% for 6s. Likewise, Elemental Skill or Elemental Burst hits increase Normal Attack DMG by 20% for 6s.
Prototype Amber (★4) > Gilding: Using an Elemental Burst regenerates 4 Energy every 2s for 6s. All party members will regenerate 4% HP every 2s for this duration.
Mappa Mare (★4) > Infusion Scroll: Triggering an Elemental reaction grants a 8% Elemental DMG Bonus for 10s. Max 2 stacks.
Blackcliff Agate (★4) > Press the Advantage: After defeating an enemy, ATK is increased by 12% for 30s. This effect has a maximum of 3 stacks, and the duration of each stack is independent of the others.
Eye of Perception (★4) > Echo: Normal and Charged Attacks have a 50% chance to fire a Bolt of Perception, dealing 240% ATK as DMG. This bolt can bounce between opponents a maximum of 4 times. This effect can occur once every 12s.     
Wine and Song (★4) > Ever-Changing: Hitting an opponent with a Normal Attack decreases the Stamina consumption of Sprint or Alternate Sprint by 14% for 5s. Additionally, using a Sprint or Alternate Sprint ability increases ATK by 20% 
for 5s.
Frostbearer (★4) > Frost Burial: Hitting an opponent with Normal and Charged Attacks has a 60% chance of forming and dropping an Everfrost Icicle above them, dealing AoE DMG equal to 80% of ATK. Opponents affected by Cryo are instead 
dealt DMG equal to 200% of ATK. Can only occur once every 10s.
Dodoco Tales (★4) > Dodoventure!: Normal Attack hits on opponents increase Charged Attack DMG by 16% for 6s. Charged Attack hits on opponents increase ATK by 8% for 6s.
Hakushin Ring (★4) > Sakura Saiguu: After the character equipped with this weapon triggers an Electro elemental reaction, nearby party members of an Elemental Type involved in the elemental reaction receive a 10% Elemental DMG Bonus for their element, lasting 6s. Elemental Bonuses gained in this way cannot be stacked.
Oathsworn Eye (★4) > People of the Faltering Light: Increases Energy Recharge by 24% for 10s after using an Elemental Skill.
Wandering Evenstar (★4) > Wildling Nightstar: The following effect will trigger every 10s: The equipping character will gain 24% of their Elemental Mastery as bonus ATK for 12s, with nearby party members gaining 30% of this buff for the same duration. Multiple instances of this weapon can allow this buff to stack. This effect will still trigger even if the character is not on the field.
Fruit of Fulfillment (★4) > Full Circle: Obtain the "Wax and Wane" effect after an Elemental Reaction is triggered, gaining 24 Elemental Mastery while losing 5% ATK. For every 0.3s, 1 stack of Wax and Wane can be gained. Max 5 stacks. For every 6s that go by without an Elemental Reaction being triggered, 1 stack will be lost. This effect can be triggered even when the character is off-field.
Skyward Atlas (★5) > Wandering Clouds: Increases Elemental DMG Bonus by 12%. Normal Attack hits have a 50% chance to earn the favor of the clouds, which actively seek out nearby opponents to attack for 15s, dealing 160% ATK DMG. Can only occur once every 30s.
Lost Prayer to the Sacred Winds (★5) > Boundless Blessing: Increases Movement SPD by 10%. When in battle, gain an 8% Elemental DMG Bonus every 4s. Max 4 stacks. Lasts until the character falls or leaves combat.
Memory of Dust (★5) > Golden Majesty: Increases Shield Strength by 20%. Scoring hits on opponents increases ATK by 4% for 8s. Max 5 stacks. Can only occur once every 0.3s. While protected by a shield, this ATK increase effect is increased by 100%.
Everlasting Moonglow (★5) > Byakuya Kougetsu: Healing Bonus increased by 10%, Normal Attack DMG is increased by 1% of the Max HP of the character equipping this weapon. For 12s after using an Elemental Burst, Normal Attacks that hit opponents will restore 0.6 Energy. Energy can be restored this way once every 0.1s.
Kagura's Verity (★5) > Kagura Dance of the Sacred Sakura: Gains the Kagura Dance effect when using an Elemental Skill, causing the Elemental Skill DMG of the character wielding this weapon to increase by 12% for 16s. Max 3 stacks. This character will gain 12% All Elemental DMG Bonus when they possess 3 stacks.
A Thousand Floating Dreams (★5) > A Thousand Nights' Dawnsong: Party members other than the equipping character will provide the equipping character with buffs based on whether their Elemental Type is the same as the latter or not. If their Elemental Types are the same, increase Elemental Mastery by 32. If not, increase the equipping character's DMG Bonus from their Elemental Type by 10%. Each of the aforementioned effects can have up to 3 stacks. Additionally, all nearby party members other than the equipping character will have their Elemental Mastery increased by 40. Multiple such effects from multiple such weapons can stack.
Tulaytullah's Remembrance (★5) > Bygone Azure Teardrop: Normal Attack SPD is increased by 10%. After the wielder unleashes an Elemental Skill, Normal Attack DMG will increase by 4.8% every second for 14s. After hitting an opponent with a Normal Attack during this duration, Normal Attack DMG will be increased by 9.6%. This increase can be triggered once every 0.3s. The maximum Normal Attack DMG increase per single duration of the overall effect is 48%. The effect will be removed when the wielder leaves the field, and using the Elemental Skill again will reset all DMG buffs.
Hunter's Bow (★1) > No refinements: No information
Seasoned Hunter's Bow (★2) > No refinements: No information
Raven Bow (★3) > Bane of Flame and Water: Increases DMG against opponents affected by Hydro or Pyro by 12%.
Sharpshooter's Oath (★3) > Precise: Increases DMG against weak spots by 24%.
Recurve Bow (★3) > Cull the Weak: Defeating an opponent restores 8% HP.
Slingshot (★3) > Slingshot: If a Normal or Charged Attack hits a target within 0.3s of being fired, increases DMG by 36%. Otherwise, decreases DMG by 10%.
Messenger (★3) > Archer's Message: Charged Attack hits on weak points deal an additional 100% ATK DMG as CRIT DMG. Can only occur once every 10s.
Ebony Bow (★3) > Decimate: Increases DMG against mechanoid Ruin opponents by 40%.
Favonius Warbow (★4) > Windfall: CRIT Hits have a 60% chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy for the character. Can only occur once every 12s.
The Stringless (★4) > Arrowless Song: Increases Elemental Skill and Elemental Burst DMG by 24%.
Sacrificial Bow (★4) > Composed: After damaging an opponent with an Elemental Skill, the skill has a 40% chance to end its own CD. Can only occur once every 30s.
Royal Bow (★4) > Focus: Upon damaging an opponent, increases CRIT Rate by 8%. Max 5 stacks. A CRIT Hit removes all stacks.
Rust (★4) > Rapid Firing: Increases Normal Attack DMG by 40% but decreases Charged Attack DMG by 10%.
Prototype Crescent (★4) > Unreturning: Charged Attack hits on weak points increase Movement SPD by 10% and ATK by 36% for 10s.
Compound Bow (★4) > Infusion Arrow: Normal Attack and Charged Attack hits increase ATK by 4% and Normal ATK SPD by 1.2% for 6s. Max 4 stacks. Can only occur once every 0.3s.
Blackcliff Warbow (★4) > Press the Advantage: After defeating an enemy, ATK is increased by 12% for 30s. This effect has a maximum of 3 stacks, and the duration of each stack is independent of the others.
The Viridescent Hunt (★4) > Verdant Wind: Upon hit, Normal and Charged Attacks have a 50% chance to generate a Cyclone, which will continuously attract surrounding opponents, dealing 40% of ATK as DMG to these opponents every 0.5s for 4s. This effect can only occur once every 14s.
Alley Hunter (★4) > Oppidan Ambush: While the character equipped with this weapon is in the party but not on the field, their DMG increases by 2% every second up to a max of 20%. When the character is on the field for more than 4s, the aforementioned DMG buff decreases by 4% per second until it reaches 0%.
Fading Twilight (★4) > Radiance of the Deeps: Has three states, Evengleam, Afterglow, and Dawnblaze, which increase DMG dealt by 6%/10%/14% respectively. When attacks hit opponents, this weapon will switch to the next state. This weapon can change states once every 7s. The character equipping this weapon can still trigger the state switch while not on the field.
Mitternachts Waltz (★4) > Evernight Duet: Normal Attack hits on opponents increase Elemental Skill DMG by 20% for 5s. Elemental Skill hits on opponents increase Normal Attack DMG by 20% for 5s.
Windblume Ode (★4) > Windblume Wish: After using an Elemental Skill, receive a boon from the ancient wish of the Windblume, increasing ATK by 16% for 6s.
Hamayumi (★4) > Full Draw: Increases Normal Attack DMG by 16% and Charged Attack DMG by 12%. When the equipping character's Energy reaches 100%, this effect is increased by 100%.
Predator (★4) > Strong Strike: Effective only on the following platform: \n"PlayStation Network"\nDealing Cryo DMG to opponents increases this character's Normal and Charged Attack DMG by 10% for 6s. This effect can have a maximum of 
2 stacks. Additionally, when Aloy equips Predator, ATK is increased by 66.
Mouun's Moon (★4) > Watatsumi Wavewalker: For every point of the entire party's combined maximum Energy capacity, the Elemental Burst DMG of the character equipping this weapon is increased by 0.12%. A maximum of 40% increased Elemental Burst DMG can be achieved this way.
King's Squire (★4) > Labyrinth Lord's Instruction: Obtain the Teachings of the Forest effect when unleashing Elemental Skills and Bursts, increasing Elemental Mastery by 60 for 12s. This effect will be removed when switching characters. When the Teachings of the Forest effect ends or is removed, it will deal 100% of ATK as DMG to 1 nearby opponent. The Teachings of the Forest effect can be triggered once every 20s.
End of the Line (★4) > Net Snapper: Triggers the Flowrider effect after using an Elemental Skill, dealing 80% ATK as AoE DMG upon hitting an opponent with an attack. Flowrider will be removed after 15s or after causing 3 instances of 
AoE DMG. Only 1 instance of AoE DMG can be caused every 2s in this way. Flowrider can be triggered once every 12s.
Skyward Harp (★5) > Echoing Ballad: Increases CRIT DMG by 20%. Hits have a 60% chance to inflict a small AoE attack, dealing 125% Physical ATK DMG. Can only occur once every 4s.
Amos' Bow (★5) > Strong-Willed: Increases Normal and Charged Attack DMG by 12%. After a Normal or Charged Attack is fired, DMG dealt increases by a further 8% every 0.1s the arrow is in the air for up to 5 times.
Elegy for the End (★5) > The Parting Refrain: A part of the "Millennial Movement" that wanders amidst the winds. Increases Elemental Mastery by 60. When the Elemental Skills or Elemental Bursts of the character wielding this weapon hit opponents, that character gains a Sigil of Remembrance. This effect can be triggered once every 0.2s and can be triggered even if said character is not on the field. When you possess 4 Sigils of Remembrance, all of them will be consumed and all nearby party members will obtain the "Millennial Movement: Farewell Song" effect for 12s. "Millennial Movement: Farewell Song" increases Elemental Mastery by 100 and increases ATK by 20%. Once this effect is triggered, you will not gain Sigils of Remembrance for 20s. Of the many effects of the "Millennial Movement," buffs of the same type will not stack.
Polar Star (★5) > Daylight's Augury: Elemental Skill and Elemental Burst DMG increased by 12%. After a Normal Attack, Charged Attack, Elemental Skill or Elemental Burst hits an opponent, 1 stack of Ashen Nightstar will be gained for 12s. When 1/2/3/4 stacks of Ashen Nightstar are present, ATK is increased by 10/20/30/48%. The stack of Ashen Nightstar created by the Normal Attack, Charged Attack, Elemental Skill or Elemental Burst will be counted independently of the others.
Aqua Simulacra (★5) > The Cleansing Form: HP is increased by 16%. When there are opponents nearby, the DMG dealt by the wielder of this weapon is increased by 20%. This will take effect whether the character is on-field or not.       
Thundering Pulse (★5) > Rule by Thunder: Increases ATK by 20% and grants the might of the Thunder Emblem. At stack levels 1/2/3, the Thunder Emblem increases Normal Attack DMG by 12/24/40%. The character will obtain 1 stack of Thunder Emblem in each of the following scenarios: Normal Attack deals DMG (stack lasts 5s), casting Elemental Skill (stack lasts 10s); Energy is less than 100% (stack disappears when Energy is full). Each stack's duration is calculated independently.
Hunter's Path (★5) > At the End of the Beast-Paths: Gain 12% All Elemental DMG Bonus. Obtain the Tireless Hunt effect after hitting an opponent with a Charged Attack. This effect increases Charged Attack DMG by 160% of Elemental Mastery. This effect will be removed after 12 Charged Attacks or 10s. Only 1 instance of Tireless Hunt can be gained every 12s.
*/