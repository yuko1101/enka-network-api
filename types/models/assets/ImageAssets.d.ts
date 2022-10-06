export = ImageAssets;
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
