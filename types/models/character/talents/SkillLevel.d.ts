export = SkillLevel;
/**
 * @en SkillLevel
 */
declare class SkillLevel {
    /**
     * @param {number} base
     * @param {number} extra
     */
    constructor(base: number, extra: number);
    /** @type {number} */
    base: number;
    /** @type {number} */
    extra: number;
    /** @type {number} */
    value: number;
}
