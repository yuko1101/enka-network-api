export = ImageAssets;
/**
 * @en ImageAssets
 */
declare class ImageAssets {
    /**
     * @param {string} name
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(name: string, enka: import("../../client/EnkaClient"));
    /** @type {import("../../client/EnkaClient")} */
    enka: import("../../client/EnkaClient");
    /** @type {string} */
    name: string;
    /** @type {string} */
    url: string;
    /** @type {string | null} */
    imageType: string | null;
    /** @type {string} */
    mihoyoUrl: string;
    /** @type {boolean} */
    isAvailable: boolean;
}
