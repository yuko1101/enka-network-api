const imageBaseUrl = "https://enka.network/ui"

module.exports = class ImageAssets {
    /**
     * @param {string} name
     */
    constructor(name) {
        this.name = name;
        this.url = name === "" ? "" : `${imageBaseUrl}/${name}.png`;
    }
}