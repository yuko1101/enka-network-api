export function bindOptions(defaultOptions: { [s: string]: unknown }, options: { [s: string]: unknown }): { [s: string]: unknown } {
    if (!options) return defaultOptions;
    if (!defaultOptions) return options;
    // TODO: use structuredClone
    const result = { ...defaultOptions };

    const nullPath = getNullPath(defaultOptions);
    for (const option of getValuesWithPath(options, [], nullPath)) {
        const { path, value } = option;

        // もしパスが途中で途切れていたら、その奥は直接コピーする
        if (!hasPath(result, path)) {
            for (let i = 0; i < path.length; i++) {
                const checkPath = path.slice(0, i + 1);

                if (!hasPath(result, checkPath)) {
                    const resultPath = checkPath.slice(0, -1);

                    if (getPath(result, resultPath) === null) {
                        resultPath.pop();
                        const object = resultPath.reduce<{ [s: string]: unknown }>((acc, key) => acc[key] as { [s: string]: unknown }, result);
                        const adjustPath = path.slice(i - 1);
                        const key = adjustPath.pop();
                        setPath(object, adjustPath, { [key as string]: value });
                        break;
                    } else {
                        const object = resultPath.reduce<{ [s: string]: unknown }>((acc, key) => acc[key] as { [s: string]: unknown }, result);
                        setPath(object, path.slice(i), value);
                        break;
                    }

                }
            }
        } else {
            const last = path.pop();
            const object = path.reduce<{ [s: string]: unknown }>((acc, key) => acc[key] as { [s: string]: unknown }, result);
            object[last as string] = value;
        }

    }
    return result;
}

/**
 * Get the path where the value is null, or undefined.
 */
function getNullPath(object: { [s: string]: unknown }, path: string[] = []): string[][] {
    const result = [];
    for (const key in object) {
        const value = object[key];
        const newPath = [...path, key];
        if (typeof value === "object" && !Array.isArray(value) && value !== null && value !== undefined) {
            result.push(...getNullPath(value as { [s: string]: unknown }, newPath));
        } else if (value === null || value === undefined) {
            result.push(newPath);
        }
    }
    return result;
}

/**
 * Warning: This function will not work with circular object.
 */
function getValuesWithPath(object: { [s: string]: unknown }, path: string[] = [], defaultOptionsNullPath: string[][] = []): { path: string[], value: unknown }[] {
    const result = [];
    for (const key in object) {
        const value = object[key];
        const newPath = [...path, key];
        if (defaultOptionsNullPath.length !== 0) {
            if (defaultOptionsNullPath.some(p => p.every((v, i) => v === newPath[i]) && newPath.length === p.length)) {
                result.push({ path: newPath, value: value });
                continue;
            }
        }
        if (typeof value === "object" && !Array.isArray(value) && value !== null && value !== undefined) {
            result.push(...getValuesWithPath(value as { [s: string]: unknown }, newPath, defaultOptionsNullPath));
        } else {
            result.push({ path: newPath, value: value });
        }
    }
    return result;
}

function getPath(object: { [s: string]: unknown }, path: string[]): unknown {
    const last = path.pop();
    for (const key of path) {
        if (!Object.keys(object).includes(key)) {
            return undefined;
        }
        object = object[key] as { [s: string]: unknown };
    }
    return object[last as string];
}

function hasPath(object: { [s: string]: unknown }, path: string[]): boolean {
    for (const key of path) {
        if (typeof object !== "object" || object === null) return false;
        if (!Object.keys(object).includes(key)) {
            return false;
        }
        object = object[key] as { [s: string]: unknown };
    }
    return true;
}

function setPath(object: { [s: string]: unknown }, path: string[], value: unknown) {
    const last = path.pop();
    for (const key of path) {
        if (Object.keys(object).includes(key)) {
            object = object[key] as { [s: string]: unknown };
        } else {
            object[key] = {};
            object = object[key] as { [s: string]: unknown };
        }
    }
    object[last as string] = value;
}

export function generateUuid(): string {
    const chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
    for (let i = 0; i < chars.length; i++) {
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