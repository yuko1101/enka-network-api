export = AssetsNotFoundError;
declare class AssetsNotFoundError extends Error {
    /**
     * @param {string} category
     * @param {string} id
     */
    constructor(category: string, id: string);
    /** @type {string} */
    category: string;
    /** @type {string} */
    id: string;
}
