/**
 * @en SkillLevel
 */
class SkillLevel {
    /**  */
    readonly base: number;
    /**  */
    readonly extra: number;
    /**  */
    readonly value: number;

    /**
     * @param base
     * @param extra
     */
    constructor(base: number, extra: number) {
        this.base = base;
        this.extra = extra;
        this.value = base + extra;
    }
}

export default SkillLevel;