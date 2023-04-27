import { JsonObject } from "config_file.js";
import { fightProps } from "../../utils/constants";
import StatusProperty from "../StatusProperty";
import EnkaClient from "../../client/EnkaClient";
import Element from "../Element";

/**
 * @en CharacterStatus
 */
export default class CharacterStatus {
    readonly _data: JsonObject;
    readonly enka: EnkaClient;
    readonly healthBase: StatusProperty;
    readonly healthFlat: StatusProperty;
    readonly healthPercent: StatusProperty;
    readonly attackBase: StatusProperty;
    readonly attackFlat: StatusProperty;
    readonly attackPercent: StatusProperty;
    readonly defenseBase: StatusProperty;
    readonly defenseFlat: StatusProperty;
    readonly defensePercent: StatusProperty;
    readonly speedBase: StatusProperty;
    readonly speedPercent: StatusProperty;
    readonly critRate: StatusProperty;
    readonly critDamage: StatusProperty;
    readonly chargeEfficiency: StatusProperty;
    readonly healAdd: StatusProperty;
    readonly healedAdd: StatusProperty;
    readonly elementMastery: StatusProperty;
    readonly physicalRes: StatusProperty;
    readonly physicalDamage: StatusProperty;
    readonly pyroDamage: StatusProperty;
    readonly electroDamage: StatusProperty;
    readonly hydroDamage: StatusProperty;
    readonly dendroDamage: StatusProperty;
    readonly anemoDamage: StatusProperty;
    readonly geoDamage: StatusProperty;
    readonly cryoDamage: StatusProperty;
    readonly pyroRes: StatusProperty;
    readonly electroRes: StatusProperty;
    readonly hydroRes: StatusProperty;
    readonly dendroRes: StatusProperty;
    readonly anemoRes: StatusProperty;
    readonly geoRes: StatusProperty;
    readonly cryoRes: StatusProperty;
    readonly matchedElementDamage: StatusProperty | null;
    readonly highestDamageBonus: StatusProperty[];
    readonly pyroEnergyCost: number;
    readonly electroEnergyCost: number;
    readonly hydroEnergyCost: number;
    readonly dendroEnergyCost: number;
    readonly anemoEnergyCost: number;
    readonly cryoEnergyCost: number;
    readonly geoEnergyCost: number;
    readonly energyCost: number;
    readonly cooldownReduction: StatusProperty;
    readonly shieldStrength: StatusProperty;
    readonly currentPyroEnergy: number;
    readonly currentElectroEnergy: number;
    readonly currentHydroEnergy: number;
    readonly currentDendroEnergy: number;
    readonly currentAnemoEnergy: number;
    readonly currentCryoEnergy: number;
    readonly currentGeoEnergy: number;
    readonly currentEnergy: number;
    readonly currentHealth: StatusProperty;
    readonly maxHealth: StatusProperty;
    readonly attack: StatusProperty;
    readonly defense: StatusProperty;
    readonly speed: StatusProperty;
    readonly statusProperties: StatusProperty[];

    constructor(data: JsonObject, enka: EnkaClient, element: Element) {
        this._data = data;

        this.enka = enka;


        this.healthBase = this.getStatusProperty(1);
        this.healthFlat = this.getStatusProperty(2);
        this.healthPercent = this.getStatusProperty(3);
        this.attackBase = this.getStatusProperty(4);
        this.attackFlat = this.getStatusProperty(5);
        this.attackPercent = this.getStatusProperty(6);
        this.defenseBase = this.getStatusProperty(7);
        this.defenseFlat = this.getStatusProperty(8);
        this.defensePercent = this.getStatusProperty(9);
        this.speedBase = this.getStatusProperty(10);
        this.speedPercent = this.getStatusProperty(11);
        this.critRate = this.getStatusProperty(20);
        this.critDamage = this.getStatusProperty(22);
        this.chargeEfficiency = this.getStatusProperty(23);
        this.healAdd = this.getStatusProperty(26);
        this.healedAdd = this.getStatusProperty(27);
        this.elementMastery = this.getStatusProperty(28);
        this.physicalRes = this.getStatusProperty(29);
        this.physicalDamage = this.getStatusProperty(30);
        this.pyroDamage = this.getStatusProperty(40);
        this.electroDamage = this.getStatusProperty(41);
        this.hydroDamage = this.getStatusProperty(42);
        this.dendroDamage = this.getStatusProperty(43);
        this.anemoDamage = this.getStatusProperty(44);
        this.geoDamage = this.getStatusProperty(45);
        this.cryoDamage = this.getStatusProperty(46);
        this.pyroRes = this.getStatusProperty(50);
        this.electroRes = this.getStatusProperty(51);
        this.hydroRes = this.getStatusProperty(52);
        this.dendroRes = this.getStatusProperty(53);
        this.anemoRes = this.getStatusProperty(54);
        this.geoRes = this.getStatusProperty(55);
        this.cryoRes = this.getStatusProperty(56);

        /**
         * Element damage bonus which matches the character's element. (Physical DMG ignored.)
         */
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
        /**
         * Including physical damage bonus, and returns list of highest damage bonus.
         * The order of the list is such that elemental matches come first.
         */
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

        this.cooldownReduction = this.getStatusProperty(80);
        this.shieldStrength = this.getStatusProperty(81);

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

        this.currentHealth = this.getStatusProperty(1010);

        this.maxHealth = this.getStatusProperty(2000);
        /** Current Attack */
        this.attack = this.getStatusProperty(2001);
        /** Current Defense */
        this.defense = this.getStatusProperty(2002);
        /** Current Speed */
        this.speed = this.getStatusProperty(2003);

        this.statusProperties = Object.values(this).filter(value => value instanceof StatusProperty);
    }

    getStatusProperty(id: number, defaultValue = 0): StatusProperty {
        return new StatusProperty(fightProps[id], (this._data[id] ?? defaultValue) as number, this.enka);
    }
}