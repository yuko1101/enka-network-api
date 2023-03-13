export = PassiveTalent;
/**
 * @en PassiveTalent
 */
declare class PassiveTalent {
    /**
    * @param {number} id
    * @param {EnkaClient} enka
    */
    constructor(id: number, enka: EnkaClient);
    /** @type {number} */
    id: number;
    /** @type {EnkaClient} */
    enka: EnkaClient;
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
    /**
     * Whether the talent is hidden in the list of talents on the in-game character screen.
     * e.g. Raiden Shogun's talent of not being able to cook. (Talent ID: 522301)
     * @type {boolean}
     */
    isHidden: boolean;
}
import EnkaClient = require("../../../client/EnkaClient");
import TextAssets = require("../../assets/TextAssets");
import ImageAssets = require("../../assets/ImageAssets");
