/**
 * @param {object} defaultOptions 
 * @param {object} options 
 * @returns {object}
 */
module.exports.bindOptions = (defaultOptions, options) => {
    if (!options) return defaultOptions;
    if (!defaultOptions) return options;
    const result = { ...defaultOptions };

    const nullPath = getNullPath(defaultOptions);
    for (const option of getValuesWithPath(options, [], nullPath)) {
        const { path, value } = option;

        // もしパスが途中で途切れていたら、その奥は直接コピーする
        if (!hasPath(result, path)) {
            for (var i = 0; i < path.length; i++) {
                const checkPath = path.slice(0, i + 1);

                if (!hasPath(result, checkPath)) {
                    const resultPath = checkPath.slice(0, -1);

                    if (getPath(result, resultPath) === null) {
                        resultPath.pop()
                        const object = resultPath.reduce((acc, key) => acc[key], result);
                        const adjustPath = path.slice(i - 1);
                        const key = adjustPath.pop();
                        setPath(object, adjustPath, { [key]: value })
                        break;
                    } else {
                        const object = resultPath.reduce((acc, key) => acc[key], result);
                        setPath(object, path.slice(i), value);
                        break;
                    }

                }
            }
        } else {
            const last = path.pop();
            const object = path.reduce((acc, key) => acc[key], result);
            object[last] = value;
        }

    }
    return result;
}

/**
 * Get the path where the value is null, or undefined.
 * @param {*} object 
 * @param {*} path 
 * @returns {Array<Array<string>>}
 */
function getNullPath(object, path = []) {
    const result = [];
    for (const key of Object.keys(object)) {
        const value = object[key];
        const newPath = [...path, key];
        if (typeof value === "object" && !Array.isArray(value) && value !== null && value !== undefined) {
            result.push(...getNullPath(value, newPath));
        } else if (value === null || value === undefined) {
            result.push(newPath);
        }
    }
    return result;
}

/** 
 * Warning: This function will not work with circular object.
 * @private
 * @param {object} object 
 * @returns {Array<{path: Array<string>, value: any}>}
 */
function getValuesWithPath(object, path = [], defaultOptionsNullPath = []) {
    const result = [];
    for (const key of Object.keys(object)) {
        const value = object[key];
        const newPath = [...path, key];
        if (defaultOptionsNullPath.length !== 0) {
            if (defaultOptionsNullPath.some(p => p.every((v, i) => v === newPath[i]) && newPath.length === p.length)) {
                result.push({ path: newPath, value: value });
                continue;
            }
        }
        if (typeof value === "object" && !Array.isArray(value) && value !== null && value !== undefined) {
            result.push(...getValuesWithPath(value, newPath, defaultOptionsNullPath));
        } else {
            result.push({ path: newPath, value: value });
        }
    }
    return result;
}

/**
 * @param {object} object 
 * @param {Array<string>} path 
 * @returns {*}
 */
function getPath(object, path) {
    for (const key of path) {
        if (!object.hasOwnProperty(key)) {
            return undefined;
        }
        object = object[key];
    }
    return object;
}

/**
 * @param {object} object
 * @param {Array<string>} path
 * @returns {boolean}
 */
function hasPath(object, path) {
    for (const key of path) {
        if (typeof object !== "object" || object === null) return false;
        if (!object.hasOwnProperty(key)) {
            return false;
        }
        object = object[key];
    }
    return true;
}

/**
 * @param {object} object 
 * @param {Array<string>} path 
 * @param {*} value 
 */
function setPath(object, path, value) {
    const last = path.pop();
    for (const key of path) {
        if (object.hasOwnProperty(key)) {
            object = object[key];
        } else {
            object[key] = {};
            object = object[key];
        }
    }
    object[last] = value;
}

/** @returns {string} */
module.exports.generateUuid = () => {
    var chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
    for (var i = 0; i < chars.length; i++) {
        switch (chars[i]) {
            case "x":
                chars[i] = Math.floor(Math.random() * 16).toString(16);
                break;
            case "y":
                chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
                break;
        }
    }
    return chars.join("");
}