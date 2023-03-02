/**
 * @param {Array<object>} array
 * @param {function(object): string} callback
 */
module.exports.separateWithValue = (array, callback) => {
    const result = {};
    for (const element of array) {
        const value = callback(element);
        if (!result[value]) result[value] = [];
        result[value].push(element);
    }
    return result;
};

/**
 * @param {object} obj
 * @param {object} newKeys
 */
module.exports.renameKeys = (obj, newKeys) => {
    const keyValues = Object.keys(obj).map(key => {
        const newKey = newKeys[key] || key;
        return { [newKey]: obj[key] };
    });
    return Object.assign({}, ...keyValues);
};