export = ArtifactData;
declare class ArtifactData {
    /**
     * @param {string} id
     * @param {EnkaClient} enka
     */
    constructor(id: string, setNameTextMapHash: any, enka: EnkaClient);
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {string} */
    id: string;
    /** @type {object} */
    _data: object;
    /** @type {TextAssets} */
    name: TextAssets;
    /** @type {TextAssets} */
    setName: TextAssets;
    /** @type {"EQUIP_BRACER" | "EQUIP_SHOES" | "EQUIP_DRESS" } Flower of Life, Plume of Death, Sands of Eon, Goblet of Eonothem, Circlet of Logos */
    equiqType: "EQUIP_BRACER" | "EQUIP_SHOES" | "EQUIP_DRESS";
    /** @type {ImageAssets} */
    icon: ImageAssets;
    /** @type {number} */
    rankLevel: number;
}
import EnkaClient = require("../../client/EnkaClient");
import TextAssets = require("../assets/TextAssets");
import ImageAssets = require("../assets/ImageAssets");