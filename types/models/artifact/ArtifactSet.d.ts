export = ArtifactSet;
/**
 * @en ArtifactSet
 */
declare class ArtifactSet {
    /**
     * @param {Array<import("./Artifact") | import("./ArtifactData") | ArtifactSet>} artifacts
     * @returns {Array<{set: ArtifactSet, count: number, activeBonus: Array<ArtifactSetBonus>}>}
     */
    static getActiveSetBonus(artifacts: Array<import("./Artifact") | import("./ArtifactData") | ArtifactSet>): Array<{
        set: ArtifactSet;
        count: number;
        activeBonus: Array<ArtifactSetBonus>;
    }>;
    /**
     * @param {number} id
     * @param {import("../../client/EnkaClient")} enka
     * @param {Object<string, any>} [data]
     */
    constructor(id: number, enka: import("../../client/EnkaClient"), data?: {
        [x: string]: any;
    } | undefined);
    /** @type {import("../../client/EnkaClient")} */
    enka: import("../../client/EnkaClient");
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
import ArtifactSetBonus = require("./ArtifactSetBonus");
import ImageAssets = require("../assets/ImageAssets");
import TextAssets = require("../assets/TextAssets");
