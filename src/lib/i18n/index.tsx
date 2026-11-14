import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DirectionProvider } from "@radix-ui/react-direction";

import type { Crop } from "@/lib/terrascope/crops";
import type { Project } from "@/lib/terrascope/projects";
import { cropText, placeName, projectText } from "./content";
import type { CropText, ProjectText } from "./content/types";
import { DEFAULT_LANG, formatDate, isLang, LANG_INFO, LANG_STORAGE_KEY, type Dir, type Lang } from "./languages";
import { ar } from "./messages/ar";
import { ary } from "./messages/ary";
import { fr, type Messages } from "./messages/fr";
import { zgh } from "./messages/zgh";

export { formatDate, LANG_INFO, LANGS, type Lang } from "./languages";
export type { Messages } from "./messages/fr";

export const MESSAGES: Record<Lang, Messages> = { fr, ar, ary, zgh };

export interface I18nValue {
  lang: Lang;
  dir: Dir;
  t: Messages;
  setLang: (lang: Lang) => void;
  crop: (c: Crop) => CropText;
  project: (p: Project) => ProjectText;
  place: (name: string | undefined) => string;
  date: (d: Date) => string;
}

/** All texts for one language, usable outside React (exports are rendered in their own language). */
export function textsFor(lang: Lang) {
  return makeValue(lang, () => {});
}

function makeValue(lang: Lang, setLang: (l: Lang) => void): I18nValue {
  return {
    lang,
    dir: LANG_INFO[lang].dir,
    t: MESSAGES[lang],
    setLang,
    crop: (c) => cropText(lang, c),
    project: (p) => projectText(lang, p),
    place: (n) => placeName(lang, n),
    date: (d) => formatDate(lang, d),
  };
}

const I18nContext = createContext<I18nValue>(makeValue(DEFAULT_LANG, () => {}));

/**
 * Holds the interface language. French is rendered on the server and on first visit;
 * a previously chosen language is restored from localStorage after hydration.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (isLang(saved)) setLangState(saved);
    } catch {
      /* storage unavailable: keep French */
    }
  }, []);

  useEffect(() => {
    const info = LANG_INFO[lang];
    document.documentElement.lang = info.htmlLang;
    document.documentElement.dir = info.dir;
    document.documentElement.dataset.script = info.script;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => makeValue(lang, setLang), [lang, setLang]);

  return (
    <I18nContext.Provider value={value}>
      <DirectionProvider dir={value.dir}>{children}</DirectionProvider>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

/** Keeps the browser tab title in the current language. */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
