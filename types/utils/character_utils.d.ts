export function getCharactersById(id: number, enka: import("../client/EnkaClient")): Array<CharacterData>;
export function hasEnergySkill(skillDepotId: number, enka: import("../client/EnkaClient")): boolean;
export function isReleased(characterId: number, enka: import("../client/EnkaClient")): boolean;
import CharacterData = require("../models/character/CharacterData");
