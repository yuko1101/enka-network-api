import { JsonObject } from "config_file.js";
import EnkaClient from "../../client/EnkaClient";
import Material from "./Material";

/**
 * @en NameCard
 * @extends {Material}
 */
export default class NameCard extends Material {
    public materialType: "MATERIAL_NAMECARD";

    /**
     * @param data If `data` provided, use `data` instead of searching with `id`.
     */
    constructor(id: number, enka: EnkaClient, data?: JsonObject) {
        super(id, enka, data);
        this.materialType = "MATERIAL_NAMECARD";
    }

    static MATERIAL_TYPE = "MATERIAL_NAMECARD";
}