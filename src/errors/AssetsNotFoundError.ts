/**
 * @en AssetsNotFoundError
 * @extends {Error}
 */
class AssetsNotFoundError extends Error {
    /** Category of assets */
    readonly category: string;
    /** Assets id */
    readonly id: string | number;

    /**
     * @param category
     * @param id
     */
    constructor(category: string, id: string | number) {
        super(`${category} ${id} was not found. Try to update cached assets with EnkaClient#cachedAssetsManager#fetchAllContents`);
        this.name = "AssetsNotFoundError";
        this.category = category;
        this.id = id;
    }
}

export default AssetsNotFoundError;