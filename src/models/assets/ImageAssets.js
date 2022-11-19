const imageBaseUrl = "https://enka.network/ui"

/** 
 * @exports ImageAssets
 * @module enka-network-api
 */
class ImageAssets {

    /**
     * @param {string} name
     */
    constructor(name) {
        /** @type {string} */
        this.name = name;

        /** @type {string} */
        this.url = name === "" ? "" : `${imageBaseUrl}/${name}.png`;

        /** @type {boolean} */
        this.isAvailable = this.name !== null && this.name !== undefined && this.name !== "";
    }
}

module.exports = ImageAssets;