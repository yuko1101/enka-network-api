const EnkaClient = require("../client/EnkaClient");
const CharacterData = require("../models/character/CharacterData");

/** 
 * @param {number} id 
 * @param {EnkaClient} enka
 * @returns {CharacterData[]}
 */
module.exports.getCharactersById = (id, enka) => {
    const data = require(enka.cachedAssetsManager.getJSONDataPath("AvatarExcelConfigData")).find(c => c.id === id);
    if (data.candSkillDepotIds && data.candSkillDepotIds.length > 0) {
        return data.candSkillDepotIds.filter(skillDepotId => this.hasEnergySkill(skillDepotId, enka)).map(skillDepotId => new CharacterData(id, enka, skillDepotId));
    } else {
        if (!this.hasEnergySkill(data.skillDepotId, enka)) return [];
        return [new CharacterData(id, enka)];
    }
}

/**
 * Determine if the character with the provided `skillDepotId` has been released.
 * @param {number} skillDepotId 
 * @param {EnkaClient} enka
 * @returns {boolean}
 */
module.exports.hasEnergySkill = (skillDepotId, enka) => {
    const data = require(enka.cachedAssetsManager.getJSONDataPath("AvatarSkillDepotExcelConfigData")).find(s => s.id === skillDepotId);
    return !!data.energySkill;
}