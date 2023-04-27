import Artifact from "../artifact/Artifact";
import CharacterData from "./CharacterData";
import Weapon from "../weapon/Weapon";
import CharacterStatus from "./CharacterStatus";
import SkillLevel from "./talents/SkillLevel";
import UpgradableSkill from "./talents/UpgradableSkill";
import NormalAttack from "./talents/NormalAttack";
import ElementalSkill from "./talents/ElementalSkill";
import ElementalBurst from "./talents/ElementalBurst";
import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import Costume from "./Costume";
import Constellation from "./Constellation";
import PassiveTalent from "./talents/PassiveTalent";
import Skill from "./talents/Skill";
import Element from "../Element";

/**
 * @en Character
 */
class Character {
    readonly enka: EnkaClient;
    readonly _data: JsonObject;
    readonly characterData: CharacterData;
    readonly costume: Costume;
    readonly artifacts: Artifact[];
    readonly weapon: Weapon;
    readonly status: CharacterStatus;
    readonly level: number;
    readonly xp: number;
    readonly ascension: number;
    readonly maxLevel: number;
    readonly stamina: number;
    readonly friendship: number;
    readonly unlockedConstellations: Constellation[];
    readonly skillLevels: { skill: UpgradableSkill; level: SkillLevel; }[];
    readonly unlockedPassiveTalents: PassiveTalent[];

    constructor(data: JsonObject, enka: EnkaClient) {

        this.enka = enka;

        this._data = data;

        this.characterData = new CharacterData(data.avatarId as number, enka, data.skillDepotId as number | undefined);

        this.costume = (data.costumeId ? this.characterData.costumes.find(c => c.id === data.costumeId) : this.characterData.costumes.find(c => c.isDefault)) as Costume;

        this.artifacts = (data.equipList as JsonObject[]).filter(item => Object.keys(item).includes("reliquary")).map(artifact => new Artifact(artifact, enka));

        this.weapon = new Weapon((data.equipList as JsonObject[]).find(item => Object.keys(item).includes("weapon")) as JsonObject, enka);

        this.status = new CharacterStatus(data.fightPropMap as JsonObject, enka, this.characterData.element as Element);

        const propMap = data.propMap as { [key: string]: JsonObject };

        this.level = Number(propMap[4001]?.val ?? 0);

        this.xp = Number(propMap[1001]?.val ?? 0);

        this.ascension = Number(propMap[1002]?.val ?? 0);

        this.maxLevel = (this.ascension + 1) * 20 - (this.ascension > 1 ? (this.ascension - 1) * 10 : 0);

        this.stamina = Number(propMap[10010]?.val ?? 10000) / 100;

        /**
         * Traveler's friendship is always 1.
         */
        this.friendship = ((data.fetterInfo as JsonObject | undefined)?.expLevel ?? 1) as number;

        this.unlockedConstellations = this.characterData.constellations.filter(c => ((data.talentIdList ?? []) as number[]).includes(c.id));

        this.skillLevels = Object.entries(data.skillLevelMap as { [key: string]: number }).map(([key, value]) => {
            const skill = this.characterData.skills.find(s => s.id.toString() === key);
            if (!skill || !(skill instanceof UpgradableSkill)) return null;

            const base = value;
            const extra = ((data.proudSkillExtraLevelMap as JsonObject)?.[skill._data.proudSkillGroupId as number] ?? 0) as number;

            return {
                skill,
                level: new SkillLevel(base, extra),
            };
        }).filter(s => s !== null).map(s => s as NonNullable<typeof s>).sort((a, b) => {
            const getScore = (skill: Skill) => (skill instanceof NormalAttack) ? 0 : (skill instanceof ElementalSkill) ? 1 : (skill instanceof ElementalBurst) ? 2 : 3;
            return getScore(a.skill) - getScore(b.skill);
        });

        this.unlockedPassiveTalents = this.characterData.passiveTalents.filter(p => ((data.inherentProudSkillList ?? []) as number[]).includes(p.id));

    }
}

export default Character;