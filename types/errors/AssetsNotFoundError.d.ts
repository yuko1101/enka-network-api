export = AssetsNotFoundError;
/**
 * @en AssetsNotFoundError
 */
declare class AssetsNotFoundError extends Error {
    /**
     * @param {string} category
     * @param {string | number} id
     */
    constructor(category: string, id: string | number);
    /** @type {string} */
    category: string;
    /** @type {string | number} */
    id: string | number;
}
