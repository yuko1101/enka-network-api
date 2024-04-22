import { LanguageCode } from "../../client/CachedAssetsManager";
import { EnkaClient } from "../../client/EnkaClient";
import { AssetsNotFoundError } from "../../errors/AssetsNotFoundError";

export class TextAssets {
    readonly id: number;
    readonly enka: EnkaClient;

    convertToHtmlFormat: boolean;
    readonly directory: string | null;

    constructor(id: number, enka: EnkaClient, convertToHtmlFormat = false, directory?: string) {
        this.id = id;
        this.enka = enka;

        this.convertToHtmlFormat = convertToHtmlFormat;
        this.directory = directory ?? null;
    }

    /**
     * @throws {AssetsNotFoundError}
     */
    get(lang?: LanguageCode): string {
        lang ??= this.enka.options.defaultLanguage;
        let text = this.enka.cachedAssetsManager.getLanguageData(lang, this.directory ?? undefined)[this.id];
        if (!text) throw new AssetsNotFoundError("Text Assets", this.id);

        if (this.convertToHtmlFormat) {
            text = text
                .replace(/<color=([^>]+)>/g, "<span style=\"color:$1\">")
                .replace(/<\/color>/g, "</span>")

                .replace(/\r\n|\n|\\n|\r/gm, "<br>");
        }

        return text;
    }

    /**
     * @returns null instead of throwing AssetsNotFoundError.
     */
    getNullable(lang?: LanguageCode): string | null {
        try {
            return this.get(lang);
        } catch (e) {
            return null;
        }
    }

    setConvertToHtmlFormat(convertToHtmlFormat: boolean): this {
        this.convertToHtmlFormat = convertToHtmlFormat;
        return this;
    }

    toString(): string {
        return this.getNullable() ?? `Unknown TextAssets(${this.id})`;
    }
}
