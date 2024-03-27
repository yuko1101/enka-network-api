class SkillLevel {
    readonly base: number;
    readonly extra: number;
    readonly value: number;

    constructor(base: number, extra: number) {
        this.base = base;
        this.extra = extra;
        this.value = base + extra;
    }
}

export default SkillLevel;