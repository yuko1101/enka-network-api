const imageBaseUrl = "https://enka.network/ui";
const imageBaseUrlMihoyo = "https://upload-os-bbs.mihoyo.com/game_record/genshin";

/** @type {object} */
const imageTypes = {
    "character_side_icon": [/^UI_AvatarIcon_Side_(.+)$/],
    "character_icon": [/^UI_AvatarIcon_(.+)$/],
    "equip": [/^UI_EquipIcon_(.+?)(_Awaken)?$/, /^UI_RelicIcon_(.+)$/],
    "constellation_icon": [/^UI_Talent_(.+)$/],
}

/** 
 * @en ImageAssets
 */
class ImageAssets {

    /**
     * @param {string} name
     */
    constructor(name) {
        /** @type {string} */
        this.name = name;

        /** @type {string} */
        this.url = name === "" ? "" : `${imageBaseUrl}/${name}.png`;

        /** @type {string} */
        this.imageType = Object.keys(imageTypes).find(type => imageTypes[type].some(regex => regex.test(name)));

        // if (!this.imageType) console.log(name);

        /** @type {string} */
        this.mihoyoUrl = (name === "" || !this.imageType) ? "" : `${imageBaseUrlMihoyo}/${name}.png`;

        /** @type {boolean} */
        this.isAvailable = this.name !== null && this.name !== undefined && this.name !== "";
    }
}

module.exports = ImageAssets;