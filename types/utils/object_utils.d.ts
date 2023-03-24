export function separateByValue<T>(array: T[], callback: (arg0: T) => string): {
    [s: string]: T[];
};
export function renameKeys(obj: {
    [x: string]: any;
}, newKeys: {
    [x: string]: any;
}): any;
