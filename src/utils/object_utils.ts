import { JsonObject } from "config_file.js";

/**
 * @template T
 * @param {Array<T>} array
 * @param {function(T): string} callback
 * @returns {{ [s: string]: T[] }}
 */
export function separateByValue<T>(array: Array<T>, callback: (element: T) => string): { [s: string]: T[]; } {
    const result = {};
    for (const element of array) {
        const value = callback(element);
        if (!result[value]) result[value] = [];
        result[value].push(element);
    }
    return result;
}

/**
 * @param {Object<string, any>} obj
 * @param {Object<string, any>} newKeys
 */
export function renameKeys(obj: JsonObject, newKeys: { [from: string]: string }) {
    const keyValues = Object.keys(obj).map(key => {
        const newKey = newKeys[key] || key;
        return { [newKey]: obj[key] };
    });
    return Object.assign({}, ...keyValues);
}