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
    customParser: (fileName: string) => string | null,
}

export class ImageAssets {
    readonly enka: EnkaClient;
    readonly name: string | null;
    readonly imageBaseUrl: ImageBaseUrl | null;
    readonly url: string | null;
    readonly isAvailable: boolean;

    constructor(name: string | null, enka: EnkaClient, maxPriority: number = Number.POSITIVE_INFINITY) {
        this.enka = enka;

        this.name = name !== "" ? name : null;

        this.imageBaseUrl = enka.options.imageBaseUrls
            .filter(url => url.priority <= maxPriority)
            .sort((a, b) => b.priority - a.priority)
            .find(url => {
                if (this.name === null) return false;
                if (!url.regexList.some(regex => regex.test(this.name as string))) return false;
                if ("customParser" in url) {
                    if ((url as CustomImageBaseUrl).customParser(this.name) == null) return false;
                }
                return true;
            }) ?? null;

        this.url = (() => {
            if (this.name === null || this.imageBaseUrl == null) return null;
            if ("customParser" in this.imageBaseUrl) {
                const filePath = (this.imageBaseUrl as CustomImageBaseUrl).customParser(this.name);
                if (filePath == null) return null;
                return `${this.imageBaseUrl.url}/${filePath}`;
            }
            return `${this.imageBaseUrl.url}/${this.name}.${this.imageBaseUrl.format.toLowerCase()}`;
        })();

        this.isAvailable = this.url !== null && this.url !== undefined && this.url !== "";
    }

    /**
     * @returns a new instance of ImageAssets with the another imageBaseUrl
     */
    nextSource(): ImageAssets | null {
        if (this.imageBaseUrl == null) return null;
        return new ImageAssets(this.name, this.enka, this.imageBaseUrl.priority - 1);
    }
}
