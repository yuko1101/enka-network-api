import EnkaClient from "../../client/EnkaClient";

const imageBaseUrlMihoyo = "https://upload-os-bbs.mihoyo.com/game_record/genshin";

const imageTypes: { [type: string]: RegExp[] } = {
    "": [/^UI_AvatarIcon_(.+)_Circle$/],
    "character_side_icon": [/^UI_AvatarIcon_Side_(.+)$/],
    "character_icon": [/^UI_AvatarIcon_(.+)$/],
    "equip": [/^UI_EquipIcon_(.+?)(_Awaken)?$/, /^UI_RelicIcon_(.+)$/],
    // "constellation_icon": [/^UI_Talent_(.+)$/],
};

/**
 * @en ImageAssets
 */
class ImageAssets {
    /**  */
    readonly enka: EnkaClient;
    /**  */
    readonly name: string;
    /**  */
    readonly imageBaseUrl: string;
    /**  */
    readonly url: string;
    /**  */
    readonly imageType: string | null;
    /**  */
    readonly mihoyoUrl: string;
    /**  */
    readonly isAvailable: boolean;

    /**
     * @param name
     * @param enka
     */
    constructor(name: string, enka: EnkaClient) {
        this.enka = enka;

        this.name = name;

        this.imageBaseUrl = Object.keys(enka.options.imageBaseUrlByRegex).find(url => enka.options.imageBaseUrlByRegex[url].some(regex => regex.test(name))) ?? enka.options.defaultImageBaseUrl;

        this.url = name === "" ? "" : `${this.imageBaseUrl}/${name}.png`;

        this.imageType = Object.keys(imageTypes).find(type => imageTypes[type].some(regex => regex.test(name))) || null;

        this.mihoyoUrl = (name === "" || !this.imageType) ? "" : `${imageBaseUrlMihoyo}/${this.imageType}/${name}.png`;

        this.isAvailable = this.name !== null && this.name !== undefined && this.name !== "";
    }
}

export default ImageAssets;