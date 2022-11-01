export = ImageAssets;
/**
 * @exports
 * @module enka-network-api
 */
declare class ImageAssets {
    /**
     * @param {string} name
     */
    constructor(name: string);
    /** @type {string} */
    name: string;
    /** @type {string} */
    url: string;
    /** @type {boolean} */
    isAvailable: boolean;
}
