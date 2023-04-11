const imageBaseUrlMihoyo = "https://upload-os-bbs.mihoyo.com/game_record/genshin";

/** @type {Object<string, any>} */
const imageTypes = {
    "character_side_icon": [/^UI_AvatarIcon_Side_(.+)$/],
    "character_icon": [/^UI_AvatarIcon_(.+)$/],
    "equip": [/^UI_EquipIcon_(.+?)(_Awaken)?$/, /^UI_RelicIcon_(.+)$/],
    // "constellation_icon": [/^UI_Talent_(.+)$/],
};

/**
 * @en ImageAssets
 */
class ImageAssets {

    /**
     * @param {string} name
     * @param {import("../../client/EnkaClient")} enka
     */
    constructor(name, enka) {
        /** @type {import("../../client/EnkaClient")} */
        this.enka = enka;

        /** @type {string} */
        this.name = name;

        /** @type {string} */
        this.imageBaseUrl = Object.entries(enka.options.imageBaseUrlByPrefix).find(entry => name.startsWith(entry[0]))?.[1] ?? enka.options.defaultImageBaseUrl;

        /** @type {string} */
        this.url = name === "" ? "" : `${this.imageBaseUrl}/${name}.png`;

        /** @type {string | null} */
        this.imageType = Object.keys(imageTypes).find(type => imageTypes[type].some(regex => regex.test(name))) ?? null;

        // if (!this.imageType) console.log(name);

        /** @type {string} */
        this.mihoyoUrl = (name === "" || !this.imageType) ? "" : `${imageBaseUrlMihoyo}/${name}.png`;

        /** @type {boolean} */
        this.isAvailable = this.name !== null && this.name !== undefined && this.name !== "";
    }
}

module.exports = ImageAssets;