const EnkaClient = require("../../client/EnkaClient");
const Artifact = require("../artifact/Artifact");
const CharacterData = require("./CharacterData");
const Weapon = require("../Weapon");
const CharacterStatus = require("./CharacterStatus");
const Constellation = require("./Constellation");

module.exports = class Character {
    /** 
     * @param {object} data
     * @param {EnkaClient} enka
     */
    constructor(data, enka) {

        /** @type {EnkaClient} */
        this.enka = enka;

        /** @type {object} */
        this._data = data;

        /** @type {CharacterData} */
        this.avatar = new CharacterData(data.avatarId, enka);

        /** @type {Artifact[]} */
        this.artifacts = data.equipList.filter(item => Object.keys(item).includes("reliquary")).map(artifact => new Artifact(artifact, enka));

        /** @type {Weapon} */
        this.weapon = new Weapon(data.equipList.find(item => Object.keys(item).includes("weapon")), enka);

        /** @type {CharacterStatus} */
        this.status = new CharacterStatus(data.fightPropMap, enka);

        /** @type {number} */
        this.level = Number(data.propMap[4001]?.ival ?? 0);

        /** @type {number} */
        this.xp = Number(data.propMap[1001]?.ival ?? 0);

        /** @type {number} */
        this.ascension = Number(data.propMap[1002]?.ival ?? 0);

        /** @type {number} */
        this.maxLevel = (this.ascension + 1) * 20 - (this.ascension > 1 ? (this.ascension - 1) * 10 : 0);

        /** @type {Constellation[]} */
        this.unlockedConstellations = data.talentIdList.map(id => new Constellation(id, enka));

        // /** @type {{}[]} */
        // this.skillLevels = data.skillLevelMap.map()
    }
}