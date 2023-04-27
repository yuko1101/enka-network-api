export const fightProps: { [key: string]: FightProp } = {
    1: "FIGHT_PROP_BASE_HP",
    2: "FIGHT_PROP_HP",
    3: "FIGHT_PROP_HP_PERCENT",
    4: "FIGHT_PROP_BASE_ATTACK",
    5: "FIGHT_PROP_ATTACK",
    6: "FIGHT_PROP_ATTACK_PERCENT",
    7: "FIGHT_PROP_BASE_DEFENSE",
    8: "FIGHT_PROP_DEFENSE",
    9: "FIGHT_PROP_DEFENSE_PERCENT",
    10: "FIGHT_PROP_BASE_SPEED",
    11: "FIGHT_PROP_SPEED_PERCENT",
    20: "FIGHT_PROP_CRITICAL",
    22: "FIGHT_PROP_CRITICAL_HURT",
    23: "FIGHT_PROP_CHARGE_EFFICIENCY",
    26: "FIGHT_PROP_HEAL_ADD",
    27: "FIGHT_PROP_HEALED_ADD",
    28: "FIGHT_PROP_ELEMENT_MASTERY",
    29: "FIGHT_PROP_PHYSICAL_SUB_HURT",
    30: "FIGHT_PROP_PHYSICAL_ADD_HURT",
    40: "FIGHT_PROP_FIRE_ADD_HURT",
    41: "FIGHT_PROP_ELEC_ADD_HURT",
    42: "FIGHT_PROP_WATER_ADD_HURT",
    43: "FIGHT_PROP_GRASS_ADD_HURT",
    44: "FIGHT_PROP_WIND_ADD_HURT",
    45: "FIGHT_PROP_ROCK_ADD_HURT",
    46: "FIGHT_PROP_ICE_ADD_HURT",
    50: "FIGHT_PROP_FIRE_SUB_HURT",
    51: "FIGHT_PROP_ELEC_SUB_HURT",
    52: "FIGHT_PROP_WATER_SUB_HURT",
    53: "FIGHT_PROP_GRASS_SUB_HURT",
    54: "FIGHT_PROP_WIND_SUB_HURT",
    55: "FIGHT_PROP_ROCK_SUB_HURT",
    56: "FIGHT_PROP_ICE_SUB_HURT",
    70: "", // Pyro Energy Cost
    71: "", // Electro Energy Cost
    72: "", // Hydro Energy Cost
    73: "", // Dendro Energy Cost
    74: "", // Anemo Energy Cost
    75: "", // Cryo Energy Cost
    76: "", // Geo Energy Cost
    80: "FIGHT_PROP_SKILL_CD_MINUS_RATIO",
    81: "FIGHT_PROP_SHIELD_COST_MINUS_RATIO",
    1000: "", // Current Pyro Energy
    1001: "", // Current Electro Energy
    1002: "", // Current Hydro Energy
    1003: "", // Current Dendro Energy
    1004: "", // Current Anemo Energy
    1005: "", // Current Cryo Energy
    1006: "", // Current Geo Energy
    1010: "FIGHT_PROP_CUR_HP",
    2000: "FIGHT_PROP_MAX_HP",
    2001: "FIGHT_PROP_CUR_ATTACK",
    2002: "FIGHT_PROP_CUR_DEFENSE",
    2003: "FIGHT_PROP_CUR_SPEED",
};

export const percent = [
    "FIGHT_PROP_HP_PERCENT",
    "FIGHT_PROP_ATTACK_PERCENT",
    "FIGHT_PROP_DEFENSE_PERCENT",
    "FIGHT_PROP_SPEED_PERCENT",

    "FIGHT_PROP_CRITICAL",
    "FIGHT_PROP_CRITICAL_HURT",

    "FIGHT_PROP_CHARGE_EFFICIENCY",

    "FIGHT_PROP_HEAL_ADD",
    "FIGHT_PROP_HEALED_ADD",
    "FIGHT_PROP_PHYSICAL_SUB_HURT",
    "FIGHT_PROP_PHYSICAL_ADD_HURT",
    "FIGHT_PROP_FIRE_ADD_HURT",
    "FIGHT_PROP_ELEC_ADD_HURT",
    "FIGHT_PROP_WATER_ADD_HURT",
    "FIGHT_PROP_GRASS_ADD_HURT",
    "FIGHT_PROP_WIND_ADD_HURT",
    "FIGHT_PROP_ROCK_ADD_HURT",
    "FIGHT_PROP_ICE_ADD_HURT",
    "FIGHT_PROP_FIRE_SUB_HURT",
    "FIGHT_PROP_ELEC_SUB_HURT",
    "FIGHT_PROP_WATER_SUB_HURT",
    "FIGHT_PROP_GRASS_SUB_HURT",
    "FIGHT_PROP_WIND_SUB_HURT",
    "FIGHT_PROP_ROCK_SUB_HURT",
    "FIGHT_PROP_ICE_SUB_HURT",

    "FIGHT_PROP_SKILL_CD_MINUS_RATIO",
    "FIGHT_PROP_SHIELD_COST_MINUS_RATIO",
];

// rarity map for artifact sets
export const artifactRarityRangeMap: { [id: string]: number[] } = {
    "10001": [3, 4], // Resolution of Sojourner
    "10002": [3, 4], // Brave Heart
    "10003": [3, 4], // Defender's Will
    "10004": [3, 4], // Tiny Miracle
    "10005": [3, 4], // Berserker
    "10006": [3, 4], // Martial Artist
    "10007": [3, 4], // Instructor
    "10008": [3, 4], // Gambler
    "10009": [3, 4], // The Exile
    "10010": [1, 3], // Adventurer
    "10011": [1, 3], // Lucky Dog
    "10012": [3, 4], // Scholar
    "10013": [1, 3], // Traveling Doctor
    "15009": [3, 4], // Prayers for Illumination
    "15010": [3, 4], // Prayers for Destiny
    "15011": [3, 4], // Prayers for Wisdom
    "15013": [3, 4], // Prayers to Springtime
};
