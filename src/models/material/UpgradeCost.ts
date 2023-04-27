import { JsonObject } from "config_file.js";
import Material from "./Material";
import EnkaClient from "../../client/EnkaClient";

/**
 * @en UpgradeCost
 */
export default class UpgradeCost {
    enka: EnkaClient;
    coin: number;
    items: { material: Material, count: number }[];

    /**
     * @param {number} coinCost
     * @param {Array<Object<string, any>>} costItems
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(coinCost: number, costItems: JsonObject[], enka: EnkaClient) {
        this.enka = enka;

        this.coin = coinCost;

        this.items = costItems.map(cost => {
            if (!cost.id) return null;
            return {
                material: Material.getMaterialById(cost.id as number, enka),
                count: cost.count as number,
            };
        }).filter(cost => cost !== null).map(cost => cost as NonNullable<typeof cost>);

    }
}