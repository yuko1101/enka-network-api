import { JsonObject } from "config_file.js";
import { fightProps } from "../../utils/constants";
import StatProperty from "../StatProperty";
import EnkaClient from "../../client/EnkaClient";
import Element from "../Element";

/**
 * @en CharacterStats
 */
class CharacterStats {
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly healthBase: StatProperty;
    /**  */
    readonly healthFlat: StatProperty;
    /**  */
    readonly healthPercent: StatProperty;
    /**  */
    readonly attackBase: StatProperty;
    /**  */
    readonly attackFlat: StatProperty;
    /**  */
    readonly attackPercent: StatProperty;
    /**  */
    readonly defenseBase: StatProperty;
    /**  */
    readonly defenseFlat: StatProperty;
    /**  */
    readonly defensePercent: StatProperty;
    /**  */
    readonly speedBase: StatProperty;
    /**  */
    readonly speedPercent: StatProperty;
    /**  */
    readonly critRate: StatProperty;
    /**  */
    readonly critDamage: StatProperty;
    /**  */
    readonly chargeEfficiency: StatProperty;
    /**  */
    readonly healAdd: StatProperty;
    /**  */
    readonly healedAdd: StatProperty;
    /**  */
    readonly elementMastery: StatProperty;
    /**  */
    readonly physicalRes: StatProperty;
    /**  */
    readonly physicalDamage: StatProperty;
    /**  */
    readonly pyroDamage: StatProperty;
    /**  */
    readonly electroDamage: StatProperty;
    /**  */
    readonly hydroDamage: StatProperty;
    /**  */
    readonly dendroDamage: StatProperty;
    /**  */
    readonly anemoDamage: StatProperty;
    /**  */
    readonly geoDamage: StatProperty;
    /**  */
    readonly cryoDamage: StatProperty;
    /**  */
    readonly pyroRes: StatProperty;
    /**  */
    readonly electroRes: StatProperty;
    /**  */
    readonly hydroRes: StatProperty;
    /**  */
    readonly dendroRes: StatProperty;
    /**  */
    readonly anemoRes: StatProperty;
    /**  */
    readonly geoRes: StatProperty;
    /**  */
    readonly cryoRes: StatProperty;
    /**
     * Element damage bonus which matches the character's element (Physical DMG ignored)
     */
    readonly matchedElementDamage: StatProperty | null;
    /**
     * Including physical damage bonus, and returns list of highest damage bonus.
     * The order of the list is such that elemental matches come first.
     */
    readonly highestDamageBonus: StatProperty[];
    /**  */
    readonly pyroEnergyCost: number;
    /**  */
    readonly electroEnergyCost: number;
    /**  */
    readonly hydroEnergyCost: number;
    /**  */
    readonly dendroEnergyCost: number;
    /**  */
    readonly anemoEnergyCost: number;
    /**  */
    readonly cryoEnergyCost: number;
    /**  */
    readonly geoEnergyCost: number;
    /**  */
    readonly energyCost: number;
    /**  */
    readonly cooldownReduction: StatProperty;
    /**  */
    readonly shieldStrength: StatProperty;
    /**  */
    readonly currentPyroEnergy: number;
    /**  */
    readonly currentElectroEnergy: number;
    /**  */
    readonly currentHydroEnergy: number;
    /**  */
    readonly currentDendroEnergy: number;
    /**  */
    readonly currentAnemoEnergy: number;
    /**  */
    readonly currentCryoEnergy: number;
    /**  */
    readonly currentGeoEnergy: number;
    /**  */
    readonly currentEnergy: number;
    /**  */
    readonly currentHealth: StatProperty;
    /**  */
    readonly maxHealth: StatProperty;
    /** The current attack of the character */
    readonly attack: StatProperty;
    /** The current defense of the character */
    readonly defense: StatProperty;
    /** The current speed of the character */
    readonly speed: StatProperty;
    /**  */
    readonly statProperties: StatProperty[];

    readonly _data: JsonObject;

    /**
     * @param data
     * @param enka
     * @param element
     */
    constructor(data: JsonObject, enka: EnkaClient, element: Element) {
        this._data = data;

        this.enka = enka;


        this.healthBase = this.getStatProperty(1);
        this.healthFlat = this.getStatProperty(2);
        this.healthPercent = this.getStatProperty(3);
        this.attackBase = this.getStatProperty(4);
        this.attackFlat = this.getStatProperty(5);
        this.attackPercent = this.getStatProperty(6);
        this.defenseBase = this.getStatProperty(7);
        this.defenseFlat = this.getStatProperty(8);
        this.defensePercent = this.getStatProperty(9);
        this.speedBase = this.getStatProperty(10);
        this.speedPercent = this.getStatProperty(11);
        this.critRate = this.getStatProperty(20);
        this.critDamage = this.getStatProperty(22);
        this.chargeEfficiency = this.getStatProperty(23);
        this.healAdd = this.getStatProperty(26);
        this.healedAdd = this.getStatProperty(27);
        this.elementMastery = this.getStatProperty(28);
        this.physicalRes = this.getStatProperty(29);
        this.physicalDamage = this.getStatProperty(30);
        this.pyroDamage = this.getStatProperty(40);
        this.electroDamage = this.getStatProperty(41);
        this.hydroDamage = this.getStatProperty(42);
        this.dendroDamage = this.getStatProperty(43);
        this.anemoDamage = this.getStatProperty(44);
        this.geoDamage = this.getStatProperty(45);
        this.cryoDamage = this.getStatProperty(46);
        this.pyroRes = this.getStatProperty(50);
        this.electroRes = this.getStatProperty(51);
        this.hydroRes = this.getStatProperty(52);
        this.dendroRes = this.getStatProperty(53);
        this.anemoRes = this.getStatProperty(54);
        this.geoRes = this.getStatProperty(55);
        this.cryoRes = this.getStatProperty(56);

        this.matchedElementDamage =
            element?.id === "Fire" ? this.pyroDamage :
                element?.id === "Electric" ? this.electroDamage :
                    element?.id === "Water" ? this.hydroDamage :
                        element?.id === "Grass" ? this.dendroDamage :
                            element?.id === "Wind" ? this.anemoDamage :
                                element?.id === "Rock" ? this.geoDamage :
                                    element?.id === "Ice" ? this.cryoDamage : null;

        const sortedDamageBonus = [this.pyroDamage, this.electroDamage, this.hydroDamage, this.dendroDamage, this.anemoDamage, this.geoDamage, this.cryoDamage, this.physicalDamage].sort((a, b) => b.value - a.value);

        const highestDamageBonusList = sortedDamageBonus.filter(d => d.value === sortedDamageBonus[0].value);
        if (highestDamageBonusList.length > 1) highestDamageBonusList.sort((a, b) => this.matchedElementDamage?.fightProp === a.fightProp ? -1 : this.matchedElementDamage?.fightProp === b.fightProp ? 1 : 0);
        this.highestDamageBonus = highestDamageBonusList;

        this.pyroEnergyCost = (data[70] ?? 0) as number;
        this.electroEnergyCost = (data[71] ?? 0) as number;
        this.hydroEnergyCost = (data[72] ?? 0) as number;
        this.dendroEnergyCost = (data[73] ?? 0) as number;
        this.anemoEnergyCost = (data[74] ?? 0) as number;
        this.cryoEnergyCost = (data[75] ?? 0) as number;
        this.geoEnergyCost = (data[76] ?? 0) as number;

        this.energyCost = Math.max(
            this.pyroEnergyCost,
            this.electroEnergyCost,
            this.hydroEnergyCost,
            this.dendroEnergyCost,
            this.anemoEnergyCost,
            this.cryoEnergyCost,
            this.geoEnergyCost,
        );

        this.cooldownReduction = this.getStatProperty(80);
        this.shieldStrength = this.getStatProperty(81);

        this.currentPyroEnergy = (data[1000] ?? 0) as number;
        this.currentElectroEnergy = (data[1001] ?? 0) as number;
        this.currentHydroEnergy = (data[1002] ?? 0) as number;
        this.currentDendroEnergy = (data[1003] ?? 0) as number;
        this.currentAnemoEnergy = (data[1004] ?? 0) as number;
        this.currentCryoEnergy = (data[1005] ?? 0) as number;
        this.currentGeoEnergy = (data[1006] ?? 0) as number;

        this.currentEnergy = Math.max(
            this.currentPyroEnergy,
            this.currentElectroEnergy,
            this.currentHydroEnergy,
            this.currentDendroEnergy,
            this.currentAnemoEnergy,
            this.currentCryoEnergy,
            this.currentGeoEnergy,
        );

        this.currentHealth = this.getStatProperty(1010);

        this.maxHealth = this.getStatProperty(2000);

        this.attack = this.getStatProperty(2001);
        this.defense = this.getStatProperty(2002);
        this.speed = this.getStatProperty(2003);

        this.statProperties = Object.values(this).filter(value => value instanceof StatProperty);
    }

    /**
     * @param id
     * @param defaultValue
     */
    getStatProperty(id: number, defaultValue = 0): StatProperty {
        return new StatProperty(fightProps[id], (this._data[id] ?? defaultValue) as number, this.enka);
    }
}

export default CharacterStats;