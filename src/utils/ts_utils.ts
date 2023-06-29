/** @typedef */
type Join<K, P> = K extends string ?
    P extends string ?
    `${K}${"" extends P ? "" : "."}${P}`
    : never : never;

/** @typedef */
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]];

/** @typedef */
export type Paths<T, D extends number = 10> = [D] extends [never] ? never : T extends object ?
    { [K in keyof T]-?: K extends string ?
        `${K}` | Join<K, Paths<T[K], Prev[D]>>
        : never
    }[keyof T] : "";