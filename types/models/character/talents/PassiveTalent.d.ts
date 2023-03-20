export = PassiveTalent;
/**
 * @en PassiveTalent
 */
declare class PassiveTalent {
    /**
    * @param {number} id
    * @param {import("../../../client/EnkaClient")} enka
    */
    constructor(id: number, enka: import("../../../client/EnkaClient"));
    /** @type {number} */
    id: number;
    /** @type {import("../../../client/EnkaClient")} */
    enka: import("../../../client/EnkaClient");
    /** @type {Object<string, any>} */
    _data: {
        [x: string]: any;
    };
    /** @type {TextAssets} */
    name: TextAssets;
    /** @type {TextAssets} */
    description: TextAssets;
    /** @type {ImageAssets} */
    icon: ImageAssets;
    /** @type {Array<StatusProperty>} */
    addProps: Array<StatusProperty>;
    /**
     * Whether the talent is hidden in the list of talents on the in-game character screen.
     * e.g. Raiden Shogun's talent of not being able to cook. (Talent ID: 522301)
     * @type {boolean}
     */
    isHidden: boolean;
}
import TextAssets = require("../../assets/TextAssets");
import ImageAssets = require("../../assets/ImageAssets");
import StatusProperty = require("../../StatusProperty");
