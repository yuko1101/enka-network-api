/** 
 * @en SkillLevel
 */
class SkillLevel {

    /** 
     * @param {number} base
     * @param {number} extra
     */
    constructor(base, extra) {
        /** @type {number} */
        this.base = base;
        /** @type {number} */
        this.extra = extra;

        /** @type {number} */
        this.value = base + extra;
    }
}

module.exports = SkillLevel;