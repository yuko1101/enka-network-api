// Avoid circular dependency causes errors.
import CachedAssetsManager from "./client/CachedAssetsManager";
import EnkaClient from "./client/EnkaClient";
import ObjectKeysManager from "./client/ObjectKeysManager";
import AssetsNotFoundError from "./errors/AssetsNotFoundError";
import Artifact from "./models/artifact/Artifact";
import ArtifactData from "./models/artifact/ArtifactData";
import ArtifactSet from "./models/artifact/ArtifactSet";
import ArtifactSetBonus from "./models/artifact/ArtifactSetBonus";
import ArtifactSplitSubstat from "./models/artifact/ArtifactSplitSubstat";
import DynamicTextAssets from "./models/assets/DynamicTextAssets";
import ImageAssets from "./models/assets/ImageAssets";
import SkillAttributeAssets from "./models/assets/SkillAttributeAssets";
import TextAssets from "./models/assets/TextAssets";
import ElementalBurst from "./models/character/talents/ElementalBurst";
import ElementalSkill from "./models/character/talents/ElementalSkill";
import NormalAttack from "./models/character/talents/NormalAttack";
import PassiveTalent from "./models/character/talents/PassiveTalent";
import Skill from "./models/character/talents/Skill";
import SkillLevel from "./models/character/talents/SkillLevel";
import UniqueSkill from "./models/character/talents/UniqueSkill";
import UpgradableSkill from "./models/character/talents/UpgradableSkill";
import Character from "./models/character/Character";
import CharacterAscension from "./models/character/CharacterAscension";
import CharacterData from "./models/character/CharacterData";
import CharacterDetails from "./models/character/CharacterDetails";
import CharacterStats from "./models/character/CharacterStats";
import CharacterVoiceData from "./models/character/CharacterVoiceData";
import Constellation from "./models/character/Constellation";
import Costume from "./models/character/Costume";
import GenshinCharacterBuild from "./models/enka/GenshinCharacterBuild";
import Material, { NameCard } from "./models/material/Material";
import UpgradeCost from "./models/material/UpgradeCost";
import Weapon from "./models/weapon/Weapon";
import WeaponAscension from "./models/weapon/WeaponAscension";
import WeaponData from "./models/weapon/WeaponData";
import WeaponRefinement from "./models/weapon/WeaponRefinement";
import WeaponRefinements from "./models/weapon/WeaponRefinements";
import DetailedGenshinUser from "./models/DetailedGenshinUser";
import Element from "./models/Element";
import GenshinUser from "./models/GenshinUser";
import ProfilePicture, { CharacterProfilePicture } from "./models/ProfilePicture";
import StatProperty from "./models/StatProperty";

// classes
export {
    EnkaClient,
    CachedAssetsManager,
    ObjectKeysManager,
    AssetsNotFoundError,
    Artifact,
    ArtifactData,
    ArtifactSet,
    ArtifactSetBonus,
    ArtifactSplitSubstat,
    DynamicTextAssets,
    ImageAssets,
    SkillAttributeAssets,
    TextAssets,
    ElementalBurst,
    ElementalSkill,
    NormalAttack,
    PassiveTalent,
    Skill,
    SkillLevel,
    UniqueSkill,
    UpgradableSkill,
    Character,
    CharacterAscension,
    CharacterData,
    CharacterDetails,
    CharacterStats,
    CharacterVoiceData,
    Constellation,
    Costume,
    GenshinCharacterBuild,
    Material,
    NameCard,
    UpgradeCost,
    Weapon,
    WeaponAscension,
    WeaponData,
    WeaponRefinement,
    WeaponRefinements,
    DetailedGenshinUser,
    Element,
    GenshinUser,
    ProfilePicture,
    CharacterProfilePicture,
    StatProperty,
};

// typedefs
export { LanguageCode, LanguageMap, NullableLanguageMap } from "./client/CachedAssetsManager";
export { EnkaClientOptions } from "./client/EnkaClient";
export { SubstatsContainer } from "./models/artifact/Artifact";
export { EquipType } from "./models/artifact/ArtifactData";
export { DynamicData, GenshinPlatform, UserInfo } from "./models/assets/DynamicTextAssets";
export { SkillAttributeData } from "./models/assets/SkillAttributeAssets";
export { BodyType, Gender, CharacterRarity } from "./models/character/CharacterData";
export { Birthday, CharacterVoiceActors, VoiceLanguage } from "./models/character/CharacterDetails";
export { ItemType } from "./models/material/Material";
export { WeaponType } from "./models/weapon/WeaponData";
export { ElementType } from "./models/Element";
export { CharacterPreview } from "./models/GenshinUser";
export { ProfilePictureType } from "./models/ProfilePicture";
export { FightProp } from "./models/StatProperty";
export { Paths } from "./utils/ts_utils";

// functions
export { fetchJSON } from "./utils/axios_utils";
export { validateCache } from "./utils/cache_utils";
export { getCharactersById, getNameIdByCharacterId, hasEnergySkill, isReleased } from "./utils/character_utils";

// constants
export { defaultEnkaClientOptions } from "./client/EnkaClient";
export { artifactRarityRangeMap, fightProps, percent } from "./utils/constants";