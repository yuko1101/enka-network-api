import TextAssets from "../assets/TextAssets";
import StatusProperty from "../StatusProperty";

/**
 * @en ArtifactSetBonus
 */
export default class ArtifactSetBonus {
    /**
     * @param {number} needCount
     * @param {Object<string, any>} data
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(needCount, data, enka) {
        /** @type {import("../../client/EnkaClient")} */
        this.enka = enka;

        /** @type {number} */
        this.id = data.affixId;

        /** @type {number} */
        this.needCount = needCount;

        /** @type {TextAssets} */
        this.description = new TextAssets(data.descTextMapHash, enka);

        /** @type {Array<StatusProperty>} */
        this.addProps = data.addProps.filter(p => Object.keys(p).includes("propType") && Object.keys(p).includes("value")).map(p => new StatusProperty(p.propType, p.value, enka));

        /** @type {Array<number>} */
        this.paramList = data.paramList;
    }
}