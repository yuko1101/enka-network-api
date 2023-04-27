import EnkaClient from "../../client/EnkaClient";

const imageBaseUrlMihoyo = "https://upload-os-bbs.mihoyo.com/game_record/genshin";

const imageTypes: { [type: string]: RegExp[] } = {
    "character_side_icon": [/^UI_AvatarIcon_Side_(.+)$/],
    "character_icon": [/^UI_AvatarIcon_(.+)$/],
    "equip": [/^UI_EquipIcon_(.+?)(_Awaken)?$/, /^UI_RelicIcon_(.+)$/],
    // "constellation_icon": [/^UI_Talent_(.+)$/],
};

/**
 * @en ImageAssets
 */
class ImageAssets {
    readonly enka: EnkaClient;
    readonly name: string;
    readonly imageBaseUrl: string;
    readonly url: string;
    readonly imageType: string | null;
    readonly mihoyoUrl: string;
    readonly isAvailable: boolean;

    constructor(name: string, enka: EnkaClient) {
        this.enka = enka;

        this.name = name;

        this.imageBaseUrl = Object.entries(enka.options.imageBaseUrlByPrefix).find(entry => name.startsWith(entry[0]))?.[1] ?? enka.options.defaultImageBaseUrl;

        this.url = name === "" ? "" : `${this.imageBaseUrl}/${name}.png`;

        this.imageType = Object.keys(imageTypes).find(type => imageTypes[type].some(regex => regex.test(name))) ?? null;

        this.mihoyoUrl = (name === "" || !this.imageType) ? "" : `${imageBaseUrlMihoyo}/${name}.png`;

        this.isAvailable = this.name !== null && this.name !== undefined && this.name !== "";
    }
}

export default ImageAssets;