import Artifact from "../artifact/Artifact";
import CharacterData from "./CharacterData";
import Weapon from "../weapon/Weapon";
import CharacterStatus from "./CharacterStatus";
import SkillLevel from "./talents/SkillLevel";
import UpgradableSkill from "./talents/UpgradableSkill";
import NormalAttack from "./talents/NormalAttack";
import ElementalSkill from "./talents/ElementalSkill";
import ElementalBurst from "./talents/ElementalBurst";
import { JsonManager, JsonObject } from "config_file.js";
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
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly characterData: CharacterData;
    /**  */
    readonly costume: Costume;
    /**  */
    readonly artifacts: Artifact[];
    /**  */
    readonly weapon: Weapon;
    /**  */
    readonly status: CharacterStatus;
    /**  */
    readonly level: number;
    /**  */
    readonly xp: number;
    /**  */
    readonly ascension: number;
    /**  */
    readonly maxLevel: number;
    /**  */
    readonly stamina: number;
    /** Traveler's friendship is always 1 */
    readonly friendship: number;
    /**  */
    readonly unlockedConstellations: Constellation[];
    /**  */
    readonly skillLevels: { skill: UpgradableSkill, level: SkillLevel }[];
    /**  */
    readonly unlockedPassiveTalents: PassiveTalent[];

    readonly _data: JsonObject;

    /**
     * @param data
     * @param enka
     */
    constructor(data: JsonObject, enka: EnkaClient) {

        this.enka = enka;

        this._data = data;

        const json = new JsonManager(this._data, true, true);

        this.characterData = new CharacterData(json.getAsNumber("avatarId"), enka, json.has("skillDepotId") ? json.getAsNumber("skillDepotId") : undefined);

        this.costume = (json.has("costumeId") ? this.characterData.costumes.find(c => c.id === json.getAsNumber("costumeId")) : this.characterData.costumes.find(c => c.isDefault)) as Costume;

        this.artifacts = json.get("equipList").detach().filter(item => item.has("reliquary")).map(artifact => new Artifact(artifact.getAsJsonObject(), enka));

        this.weapon = new Weapon(json.get("equipList").detach().find(item => item.has("weapon"))?.getAsJsonObject() as JsonObject, enka);

        this.status = new CharacterStatus(json.getAsJsonObject("fightPropMap"), enka, this.characterData.element as Element);

        const propMap = json.get("propMap").detach();

        this.level = Number(propMap.has("4001", "val") ? propMap.get("4001", "val").getAsString() : 0);

        this.xp = Number(propMap.has("1001", "val") ? propMap.get("1001", "val").getAsString() : 0);

        this.ascension = Number(propMap.has("1002", "val") ? propMap.get("1002", "val").getAsString() : 0);

        this.maxLevel = (this.ascension + 1) * 20 - (this.ascension > 1 ? (this.ascension - 1) * 10 : 0);

        this.stamina = Number(propMap.has("10010", "val") ? propMap.get("10010", "val").getAsString() : 10000) / 100;

        const fetterInfo = json.get("fetterInfo");
        this.friendship = fetterInfo.has("expLevel") ? fetterInfo.getAsNumber("expLevel") : 1;

        this.unlockedConstellations = this.characterData.constellations.filter(c => (json.has("talentIdList") ? json.get("talentIdList").map(p => p.getAsNumber()) : []).includes(c.id));

        this.skillLevels = json.get("skillLevelMap").map(p => [p.route.slice(-1)[0], p.getAsNumber()] as [string, number]).map(([key, value]) => {
            const skill = this.characterData.skills.find(s => s.id.toString() === key);
            if (!skill || !(skill instanceof UpgradableSkill)) return null;

            const base = value;

            const proudSkillExtraLevelMap = json.get("proudSkillExtraLevelMap");
            const proudSkillGroupId: string = new JsonManager(skill._data, true, true).getAsNumber("proudSkillGroupId").toString();
            const extra = proudSkillExtraLevelMap.has(proudSkillGroupId) ? proudSkillExtraLevelMap.getAsNumber(proudSkillGroupId) : 0;

            return {
                skill,
                level: new SkillLevel(base, extra),
            };
        }).filter(s => s !== null).map(s => s as NonNullable<typeof s>).sort((a, b) => {
            const getScore = (skill: Skill) => (skill instanceof NormalAttack) ? 0 : (skill instanceof ElementalSkill) ? 1 : (skill instanceof ElementalBurst) ? 2 : 3;
            return getScore(a.skill) - getScore(b.skill);
        });

        this.unlockedPassiveTalents = this.characterData.passiveTalents.filter(p => (json.has("inherentProudSkillList") ? json.get("inherentProudSkillList").map(e => e.getAsNumber()) : []).includes(p.id));

    }
}

export default Character;