import { EnkaClient } from "../../client/EnkaClient";

export interface ImageBaseUrl {
    url: string,
    regexList: RegExp[],
    priority: number,
    format: "PNG" | "WEBP" | "JPG",
}

export interface CustomImageBaseUrl extends ImageBaseUrl {
    /**
     * @param fileName fileName without extension
     * @returns fileName **with** extension
     */
    customParser: (fileName: string) => string,
}

const imageBaseUrlMihoyo = "https://upload-os-bbs.mihoyo.com/game_record/genshin";

const imageTypes: { [type: string]: RegExp[] } = {
    "": [/^UI_AvatarIcon_(.+)_Circle$/],
    "character_side_icon": [/^UI_AvatarIcon_Side_(.+)$/],
    "character_icon": [/^UI_AvatarIcon_(.+)$/],
    "equip": [/^UI_EquipIcon_(.+?)(_Awaken)?$/, /^UI_RelicIcon_(.+)$/],
    // "constellation_icon": [/^UI_Talent_(.+)$/],
};

export class ImageAssets {
    readonly enka: EnkaClient;
    readonly name: string;
    readonly imageBaseUrl: ImageBaseUrl | null;
    readonly url: string;
    readonly imageType: string | null;
    readonly mihoyoUrl: string;
    readonly isAvailable: boolean;

    constructor(name: string, enka: EnkaClient, maxPriority: number = Number.POSITIVE_INFINITY) {
        this.enka = enka;

        this.name = name;

        this.imageBaseUrl = enka.options.imageBaseUrls.filter(url => url.priority <= maxPriority).sort((a, b) => b.priority - a.priority).find(url => url.regexList.some(regex => regex.test(name))) ?? null;

        this.url = (() => {
            if (this.name === "" || this.imageBaseUrl == null) return "";
            if ("customParser" in this.imageBaseUrl) return `${this.imageBaseUrl.url}/${(this.imageBaseUrl as CustomImageBaseUrl).customParser(this.name)}`;
            return `${this.imageBaseUrl.url}/${this.name}.${this.imageBaseUrl.format.toLowerCase()}`;
        })();

        this.imageType = Object.keys(imageTypes).find(type => imageTypes[type].some(regex => regex.test(name))) || null;

        this.mihoyoUrl = (name === "" || !this.imageType) ? "" : `${imageBaseUrlMihoyo}/${this.imageType}/${name}.png`;

        this.isAvailable = this.name !== null && this.name !== undefined && this.name !== "";
    }

    /**
     * @returns a new instance of ImageAssets with the another imageBaseUrl
     */
    nextSource(): ImageAssets | null {
        if (this.imageBaseUrl == null) return null;
        return new ImageAssets(this.name, this.enka, this.imageBaseUrl.priority - 1);
    }
}
