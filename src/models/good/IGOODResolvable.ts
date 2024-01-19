import { FightProp } from "../StatProperty";
import { EquipType } from "../artifact/ArtifactData";
import { IGOODComponent, SlotKey, StatKey } from "./GOOD";

export interface IGOODComponentResolvable<T extends IGOODComponent> {
    toGOOD(): T;
}

export function convertToGOODKey<T extends string>(name: string): T {
    return name.replace(/[^a-zA-Z0-9 ]/g, "").split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("") as T;
}

export const artifactSlotMap = {
    EQUIP_BRACER: "flower",
    EQUIP_NECKLACE: "plume",
    EQUIP_SHOES: "sands",
    EQUIP_RING: "goblet",
    EQUIP_DRESS: "circlet",
} as const satisfies { [key in EquipType]: SlotKey };

export function convertToGOODArtifactSlotKey(slot: EquipType): SlotKey {
    return artifactSlotMap[slot];
}

export const statKeyMap = {
    hp: "FIGHT_PROP_HP",
    hp_: "FIGHT_PROP_HP_PERCENT",
    atk: "FIGHT_PROP_ATTACK",
    atk_: "FIGHT_PROP_ATTACK_PERCENT",
    def: "FIGHT_PROP_DEFENSE",
    def_: "FIGHT_PROP_DEFENSE_PERCENT",
    eleMas: "FIGHT_PROP_ELEMENT_MASTERY",
    enerRech_: "FIGHT_PROP_CHARGE_EFFICIENCY",
    heal_: "FIGHT_PROP_HEAL_ADD",
    critRate_: "FIGHT_PROP_CRITICAL",
    critDMG_: "FIGHT_PROP_CRITICAL_HURT",
    physical_dmg_: "FIGHT_PROP_PHYSICAL_ADD_HURT",
    anemo_dmg_: "FIGHT_PROP_WIND_ADD_HURT",
    geo_dmg_: "FIGHT_PROP_ROCK_ADD_HURT",
    electro_dmg_: "FIGHT_PROP_ELEC_ADD_HURT",
    hydro_dmg_: "FIGHT_PROP_WATER_ADD_HURT",
    pyro_dmg_: "FIGHT_PROP_FIRE_ADD_HURT",
    cryo_dmg_: "FIGHT_PROP_ICE_ADD_HURT",
    dendro_dmg_: "FIGHT_PROP_GRASS_ADD_HURT",
} as const satisfies { [key in StatKey]: FightProp };

const statKeyMapReverse = Object.fromEntries(Object.entries(statKeyMap).map(([key, value]) => [value, key])) as { [key: string]: StatKey };
export function convertToGOODStatKey(stat: FightProp): StatKey {
    return statKeyMapReverse[stat];
}