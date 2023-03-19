const CharacterData = require("../models/character/CharacterData");

/**
 * @param {number} id
 * @param {import("../client/EnkaClient")} enka
 * @returns {Array<CharacterData>}
 */
module.exports.getCharactersById = (id, enka) => {
    const data = enka.cachedAssetsManager.getGenshinCacheData("AvatarExcelConfigData").find(c => c.id === id);
    if (data.candSkillDepotIds && data.candSkillDepotIds.length > 0) {
        return data.candSkillDepotIds.filter(skillDepotId => this.hasEnergySkill(skillDepotId, enka)).map(skillDepotId => new CharacterData(id, enka, skillDepotId));
    } else {
        if (!this.hasEnergySkill(data.skillDepotId, enka)) return [];
        return [new CharacterData(id, enka)];
    }
};

/**
 * @param {number} skillDepotId
 * @param {import("../client/EnkaClient")} enka
 * @returns {boolean}
 */
module.exports.hasEnergySkill = (skillDepotId, enka) => {
    const data = enka.cachedAssetsManager.getGenshinCacheData("AvatarSkillDepotExcelConfigData").find(s => s.id === skillDepotId);
    return !!data.energySkill;
};

/**
 * @param {number} characterId
 * @param {import("../client/EnkaClient")} enka
 * @returns {boolean}
 */
module.exports.isReleased = (characterId, enka) => {
    const releaseData = enka.cachedAssetsManager.getGenshinCacheData("AvatarCodexExcelConfigData").find(r => r.avatarId === characterId);
    return releaseData || enka.cachedAssetsManager.getGenshinCacheData("AvatarHeroEntityExcelConfigData").map(t => t.avatarId).includes(characterId);
};
