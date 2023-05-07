import { JsonReader, JsonObject } from "config_file.js";
import Material from "./Material";
import EnkaClient from "../../client/EnkaClient";

/**
 * @en UpgradeCost
 */
class UpgradeCost {
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly coin: number;
    /**  */
    readonly items: { material: Material, count: number }[];

    /**
     * @param coinCost
     * @param costItems
     * @param enka
     */
    constructor(coinCost: number, costItems: JsonObject[], enka: EnkaClient) {
        this.enka = enka;

        this.coin = coinCost;

        const itemsJson = new JsonReader(costItems);

        this.items = itemsJson.mapArray((_, cost) => {
            if (!cost.has("id")) return null;
            return {
                material: Material.getMaterialById(cost.getAsNumber("id"), enka),
                count: cost.getAsNumber("count"),
            };
        }).filter(cost => cost !== null).map(cost => cost as NonNullable<typeof cost>);

    }
}

export default UpgradeCost;