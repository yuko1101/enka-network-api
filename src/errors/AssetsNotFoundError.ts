/**
 * @en AssetsNotFoundError
 * @extends {Error}
 */
export default class AssetsNotFoundError extends Error {
    readonly category: string;
    readonly id: string | number;

    constructor(category: string, id: string | number) {
        super(`${category} ${id} was not found. Try to update cached assets with EnkaClient#cachedAssetsManager#fetchAllContents`);
        /** @type {string} */
        this.name = "AssetsNotFoundError";
        /** @type {string} */
        this.category = category;
        /** @type {string | number} */
        this.id = id;
    }
}