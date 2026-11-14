export const LANGS = ["fr", "ar", "ary", "zgh"] as const;
export type Lang = (typeof LANGS)[number];
export type Dir = "ltr" | "rtl";
/** Visual identity shown next to each language in the switcher. */
export type LangMark = "fr" | "arabic" | "ma" | "tifinagh";
export type Script = "latin" | "arabic" | "tifinagh";

export const DEFAULT_LANG: Lang = "fr";
export const LANG_STORAGE_KEY = "terrascope.lang";

export interface LangInfo {
  code: Lang;
  /** Native name shown in the switcher. */
  name: string;
  /** Short label for the compact trigger. */
  short: string;
  /** Secondary label identifying the language for any reader. */
  hint: string;
  dir: Dir;
  script: Script;
  /** BCP-47 tag for the <html lang> attribute. */
  htmlLang: string;
  /** Locale used for dates and numbers (Latin digits everywhere). */
  locale: string;
  mark: LangMark;
}

export const LANG_INFO: Record<Lang, LangInfo> = {
  fr: { code: "fr", name: "Français", short: "Français", hint: "FR", dir: "ltr", script: "latin", htmlLang: "fr", locale: "fr-FR", mark: "fr" },
  ar: { code: "ar", name: "العربية", short: "العربية", hint: "AR", dir: "rtl", script: "arabic", htmlLang: "ar", locale: "ar-MA-u-nu-latn", mark: "arabic" },
  ary: { code: "ary", name: "الدارجة المغربية", short: "الدارجة", hint: "Darija", dir: "rtl", script: "arabic", htmlLang: "ary", locale: "ar-MA-u-nu-latn", mark: "ma" },
  zgh: { code: "zgh", name: "ⵜⴰⵎⴰⵣⵉⵖⵜ", short: "ⵜⴰⵎⴰⵣⵉⵖⵜ", hint: "Amazigh", dir: "ltr", script: "tifinagh", htmlLang: "zgh-Tfng", locale: "fr-FR", mark: "tifinagh" },
};

export function isLang(v: unknown): v is Lang {
  return typeof v === "string" && (LANGS as readonly string[]).includes(v);
}

/** Numeric date (dd/mm/yyyy style) in the language's locale, always with Latin digits. */
export function formatDate(lang: Lang, d: Date) {
  return new Intl.DateTimeFormat(LANG_INFO[lang].locale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
}
