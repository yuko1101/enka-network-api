export = ArtifactSet;
/**
 * @en ArtifactSet
 */
declare class ArtifactSet {
    /**
     * @param {number} id
     * @param {EnkaClient} enka
     * @param {Object<string, any>} [data]
     */
    constructor(id: number, enka: EnkaClient, data?: {
        [x: string]: any;
    } | undefined);
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {number} */
    id: number;
    /** @type {Object<string, any>} */
    _data: {
        [x: string]: any;
    };
    /** @type {Array<Object<string, any>>} */
    _setBonusData: Array<{
        [x: string]: any;
    }>;
    /** @type {Array<ArtifactSetBonus>} */
    setBonus: Array<ArtifactSetBonus>;
    /** @type {ImageAssets} */
    icon: ImageAssets;
    /** @type {TextAssets} */
    name: TextAssets;
}
import EnkaClient = require("../../client/EnkaClient");
import ArtifactSetBonus = require("./ArtifactSetBonus");
import ImageAssets = require("../assets/ImageAssets");
import TextAssets = require("../assets/TextAssets");
