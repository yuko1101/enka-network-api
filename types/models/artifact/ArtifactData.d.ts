export = ArtifactData;
declare class ArtifactData {
    /**
     * @param {number} id
     * @param {number} setNameTextMapHash
     * @param {EnkaClient} enka
     */
    constructor(id: number, setNameTextMapHash: number, enka: EnkaClient);
    /** @type {EnkaClient} */
    enka: EnkaClient;
    /** @type {number} */
    id: number;
    /** @type {object} */
    _data: object;
    /** @type {TextAssets} */
    name: TextAssets;
    /** @type {TextAssets} */
    description: TextAssets;
    /** @type {object} */
    _setData: object;
    /** @type {TextAssets} */
    setName: TextAssets;
    /** @type {TextAssets} */
    setDescription: TextAssets;
    /** @type {"EQUIP_BRACER" | "EQUIP_NECKLACE" | "EQUIP_SHOES" | "EQUIP_RING" | "EQUIP_DRESS" } Flower of Life, Plume of Death, Sands of Eon, Goblet of Eonothem, Circlet of Logos */
    equipType: "EQUIP_BRACER" | "EQUIP_NECKLACE" | "EQUIP_SHOES" | "EQUIP_RING" | "EQUIP_DRESS";
    /** @type {object} */
    _equipTypeData: object;
    /** @type {TextAssets} */
    equiqTypeName: TextAssets;
    /** @type {ImageAssets} */
    icon: ImageAssets;
    /** @type {number} */
    stars: number;
}
import EnkaClient = require("../../client/EnkaClient");
import TextAssets = require("../assets/TextAssets");
import ImageAssets = require("../assets/ImageAssets");
