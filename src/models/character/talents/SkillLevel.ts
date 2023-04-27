/**
 * @en SkillLevel
 */
export default class SkillLevel {
    public base: number;
    public extra: number;
    public value: number;

    /**
     * @param {number} base
     * @param {number} extra
     */
    constructor(base: number, extra: number) {
        this.base = base;
        this.extra = extra;
        this.value = base + extra;
    }
}