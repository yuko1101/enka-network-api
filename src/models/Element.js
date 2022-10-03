// TODO: i18n and icons
const elements = {
    "wind": {
        "inGameName": "anemo"
    },
    "ice": {
        "inGameName": "cryo"
    },
    "grass": {
        "inGameName": "dendro"
    },
    "electric": {
        "inGameName": "electro"
    },
    "rock": {
        "inGameName": "geo"
    },
    "water": {
        "inGameName": "hydro"
    },
    "fire": {
        "inGameName": "pyro"
    }
}

module.exports = class Element {
    /** @param {string} name */
    constructor(name) {
        /** @type {object} */
        this._data = elements[name.toLowerCase()];

        /** @type {string} */
        this.inGameName = this._data.inGameName;
    }
}