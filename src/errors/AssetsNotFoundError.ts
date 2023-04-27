/**
 * @en AssetsNotFoundError
 * @extends {Error}
 */
export default class AssetsNotFoundError extends Error {
    public category: string;
    public id: string | number;

    /**
     * @param {string} category
     * @param {string | number} id
     */
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