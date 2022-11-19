/** 
 * @exports AssetsNotFoundError
 * @module enka-network-api
 */
class AssetsNotFoundError extends Error {

    /**
     * @param {string} category 
     * @param {string | number} id 
     */
    constructor(category, id) {
        super(`${category} ${id} was not found. Try to update cached assets using EnkaClient#cachedAssetsManager#fetchAllContents`);
        /** @type {string} */
        this.name = "AssetsNotFoundError";
        /** @type {string} */
        this.category = category;
        /** @type {string | number} */
        this.id = id;
    }
}

module.exports = AssetsNotFoundError;