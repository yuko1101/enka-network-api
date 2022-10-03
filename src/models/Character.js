const EnkaClient = require("../client/EnkaClient");
const Artifact = require("./artifact/Artifact");
const CharacterData = require("./CharacterData");
const Weapon = require("./Weapon");

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

        // TODO: add more info such as character status
    }
}