import { LanguageCode } from "../../client/CachedAssetsManager";
import EnkaClient from "../../client/EnkaClient";
import AssetsNotFoundError from "../../errors/AssetsNotFoundError";

/**
 * @en TextAssets
 */
class TextAssets {
    /**  */
    readonly id: number;
    /**  */
    readonly enka: EnkaClient;

    /**
     * @param id
     * @param enka
     */
    constructor(id: number, enka: EnkaClient) {
        this.id = id;

        this.enka = enka;
    }

    /**
     * @param lang
     * @throws {AssetsNotFoundError}
     */
    get(lang?: LanguageCode): string {
        lang ??= this.enka.options.defaultLanguage;
        const text = this.enka.cachedAssetsManager.getLanguageData(lang)[this.id];
        if (!text) throw new AssetsNotFoundError("Text Assets", this.id);
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

    /**
     * @returns whether the text is formatted or not.
     */
    isFormatted(lang?: LanguageCode): boolean {
        const text = this.getNullable(lang);
        return isTextFormatted(text);
    }

    getAsFormattedText(lang?: LanguageCode): FormattedText {
        const text = this.get(lang);
        return new FormattedText(text.replace(/^#/, ""), text.startsWith("#"));
    }

    /**
     * @returns null instead of throwing AssetsNotFoundError.
     */
    getAsNullableFormattedText(lang?: LanguageCode): FormattedText | null {
        try {
            return this.getAsFormattedText(lang);
        } catch (e) {
            return null;
        }
    }

    toString(): string {
        return this.getNullable() ?? `Unknown TextAssets(${this.id})`;
    }
}

export default TextAssets;

function isTextFormatted(text: string | null) {
    if (text === null) return false;
    return text.startsWith("#") || /<.+>/.test(text);
}

function hasTextPlaceholder(text: string) {
    return /\{([^#]+)#([^}]+)\}/.test(text);
}

class FormattedText {
    readonly formattedWithPlaceholder: boolean;
    readonly text: string;

    constructor(text: string, formattedWithPlaceholder: boolean) {
        this.text = text;

        this.formattedWithPlaceholder = formattedWithPlaceholder;
    }

    hasPlaceholder() {
        return this.formattedWithPlaceholder && hasTextPlaceholder(this.text);
    }

    replacePlaceholder(placeholderMap: { [s: string]: boolean; }): FormattedText {
        if (!this.hasPlaceholder()) return new FormattedText(this.text, this.formattedWithPlaceholder);

        const replaced = this.text.replace(/\{([^#]+)#([^}]+)\}/g, (_, $1, $2) => placeholderMap[$1] ? $2 : "");
        return new FormattedText(replaced, this.formattedWithPlaceholder);
    }

    /**
     * Make colors and other formatting work in HTML.
     */
    replaceHTML(): FormattedText {
        const replaced = this.text
            .replace(/<color=([^>]+)>/g, "<span style=\"color:$1\">")
            .replace(/<\/color>/g, "</span>")

            .replace(/\r\n|\n|\\n|\r/gm, "<br>");

        return new FormattedText(replaced, this.formattedWithPlaceholder);
    }
}