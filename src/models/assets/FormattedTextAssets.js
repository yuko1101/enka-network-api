const TextAssets = require("./TextAssets");

/**
 * @en FormattedTextAssets
 * @extends {TextAssets}
 */
class FormattedTextAssets extends TextAssets {
    /**
     * @param {number} id
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(id, enka) {
        super(id, enka);
    }
}

module.exports = FormattedTextAssets;