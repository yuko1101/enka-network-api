const Material = require("./Material");

/**
 * @en NameCard
 * @extends {Material}
 */
class NameCard extends Material {

    /**
     * @param {number} id
     * @param {import("../../client/EnkaClient")} enka
     * @param {Object<string, any>} [data] If `data` provided, use `data` instead of searching with `id`.
     */
    constructor(id, enka, data = null) {
        super(id, enka, data);

        /** @type {"MATERIAL_NAMECARD"} */
        this.materialType;
    }

    /** @type {"MATERIAL_NAMECARD"} */
    static MATERIAL_TYPE = "MATERIAL_NAMECARD";
}

module.exports = NameCard;