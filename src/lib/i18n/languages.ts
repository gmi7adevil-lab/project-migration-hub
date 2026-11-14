export const LANGS = ["fr", "ar", "ary", "zgh"] as const;
export type Lang = (typeof LANGS)[number];
export type Dir = "ltr" | "rtl";
export type FlagId = "fr" | "ma" | "amazigh";

export const DEFAULT_LANG: Lang = "fr";
export const LANG_STORAGE_KEY = "terrascope.lang";

export interface LangInfo {
  code: Lang;
  /** Native name shown in the switcher. */
  name: string;
  /** Short secondary label identifying the language for any reader. */
  hint: string;
  dir: Dir;
  /** BCP-47 tag for the <html lang> attribute. */
  htmlLang: string;
  flag: FlagId;
}

export const LANG_INFO: Record<Lang, LangInfo> = {
  fr: { code: "fr", name: "Français", hint: "FR", dir: "ltr", htmlLang: "fr", flag: "fr" },
  ar: { code: "ar", name: "العربية", hint: "AR", dir: "rtl", htmlLang: "ar", flag: "ma" },
  ary: { code: "ary", name: "الدارجة المغربية", hint: "Darija", dir: "rtl", htmlLang: "ary", flag: "ma" },
  zgh: { code: "zgh", name: "تامازيغت", hint: "ⵜⴰⵎⴰⵣⵉⵖⵜ", dir: "rtl", htmlLang: "zgh-Arab", flag: "amazigh" },
};

export function isLang(v: unknown): v is Lang {
  return typeof v === "string" && (LANGS as readonly string[]).includes(v);
}
