// Avoid circular dependency causes errors.
// EnkaClient must be first.
const EnkaClient = require("./client/EnkaClient");
const CachedAssetsManager = require("./client/CachedAssetsManager");
const ObjectKeysManager = require("./client/ObjectKeysManager");
const AssetsNotFoundError = require("./errors/AssetsNotFoundError");
const EnkaNetworkError = require("./errors/EnkaNetworkError");
const UserNotFoundError = require("./errors/UserNotFoundError");
const Artifact = require("./models/artifact/Artifact");
const ArtifactData = require("./models/artifact/ArtifactData");
const ArtifactSet = require("./models/artifact/ArtifactSet");
const ArtifactSetBonus = require("./models/artifact/ArtifactSetBonus");
const ArtifactSplitSubstat = require("./models/artifact/ArtifactSplitSubstat");
const ImageAssets = require("./models/assets/ImageAssets");
const SkillAttributeAssets = require("./models/assets/SkillAttributeAssets");
const TextAssets = require("./models/assets/TextAssets");
const ElementalBurst = require("./models/character/talents/ElementalBurst");
const ElementalSkill = require("./models/character/talents/ElementalSkill");
const NormalAttack = require("./models/character/talents/NormalAttack");
const PassiveTalent = require("./models/character/talents/PassiveTalent");
const Skill = require("./models/character/talents/Skill");
const SkillLevel = require("./models/character/talents/SkillLevel");
const UniqueSkill = require("./models/character/talents/UniqueSkill");
const UpgradableSkill = require("./models/character/talents/UpgradableSkill");
const Character = require("./models/character/Character");
const CharacterAscension = require("./models/character/CharacterAscension");
const CharacterData = require("./models/character/CharacterData");
const CharacterDetails = require("./models/character/CharacterDetails");
const CharacterStatus = require("./models/character/CharacterStatus");
const StatusProperty = require("./models/StatusProperty");
const Constellation = require("./models/character/Constellation");
const Costume = require("./models/character/Costume");
const CharacterBuild = require("./models/enka/CharacterBuild");
const EnkaProfile = require("./models/enka/EnkaProfile");
// EnkaUser must be after EnkaProfile. (EnkaUser -> User -> EnkaProfile -> EnkaUser)
const EnkaUser = require("./models/enka/EnkaUser");
const Material = require("./models/material/Material");
const NameCard = require("./models/material/NameCard");
const UpgradeCost = require("./models/material/UpgradeCost");
const Weapon = require("./models/weapon/Weapon");
const WeaponData = require("./models/weapon/WeaponData");
const WeaponRefinement = require("./models/weapon/WeaponRefinement");
const WeaponRefinements = require("./models/weapon/WeaponRefinements");
const DetailedUser = require("./models/DetailedUser");
const Element = require("./models/Element");
const User = require("./models/User");

module.exports = {
    EnkaClient,
    CachedAssetsManager,
    ObjectKeysManager,
    AssetsNotFoundError,
    EnkaNetworkError,
    UserNotFoundError,
    Artifact,
    ArtifactData,
    ArtifactSet,
    ArtifactSetBonus,
    ArtifactSplitSubstat,
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
    CharacterStatus,
    StatusProperty,
    Constellation,
    Costume,
    CharacterBuild,
    EnkaProfile,
    EnkaUser,
    Material,
    NameCard,
    UpgradeCost,
    Weapon,
    WeaponData,
    WeaponRefinement,
    WeaponRefinements,
    DetailedUser,
    Element,
    User,
};