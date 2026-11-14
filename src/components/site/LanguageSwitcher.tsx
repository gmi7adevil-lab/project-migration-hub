import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown } from "lucide-react";

import { LANG_INFO, LANGS, useI18n, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { BrowserGlyph, LanguageMark } from "./LanguageMark";

/** Compact language selector: tiny browser glyph + current language + chevron. */
export function LanguageSwitcher({ tone = "dark", compact = false }: { tone?: "dark" | "light"; compact?: boolean }) {
  const { lang, setLang, t, dir } = useI18n();
  const light = tone === "light";
  const current = LANG_INFO[lang];

  return (
    <DropdownMenu.Root dir={dir} modal={false}>
      <DropdownMenu.Trigger
        aria-label={`${t.nav.chooseLanguage} — ${current.name}`}
        className={cn(
          light ? "nav-glass-light text-forest" : "nav-glass text-ivory",
          "lang-trigger group inline-flex h-8 items-center gap-1.5 rounded-full ps-2.5 pe-2 text-xs font-medium focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:outline-none",
        )}
      >
        <BrowserGlyph className={light ? "text-primary" : "text-accent"} />
        {!compact && (
          <span className="max-w-[6rem] truncate" lang={current.htmlLang}>
            {current.short}
          </span>
        )}
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-3 transition-transform duration-300 group-data-[state=open]:rotate-180",
            light ? "text-forest/45" : "text-ivory/55",
          )}
        />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={8} className="lang-menu z-[70] w-56 rounded-xl p-1" aria-label={t.nav.language}>
          <DropdownMenu.Label className="lang-menu-label">{t.nav.language}</DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={lang} onValueChange={(v) => setLang(v as Lang)}>
            {LANGS.map((code) => {
              const info = LANG_INFO[code];
              return (
                <DropdownMenu.RadioItem key={code} value={code} className="lang-item">
                  <LanguageMark mark={info.mark} />
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium" dir={info.dir} lang={info.htmlLang}>
                    {info.name}
                  </span>
                  <span className="lang-item-hint" dir="ltr">
                    {info.hint}
                  </span>
                  <span className="flex size-3.5 items-center justify-center">
                    <DropdownMenu.ItemIndicator className="text-accent">
                      <Check className="size-3.5" />
                    </DropdownMenu.ItemIndicator>
                  </span>
                </DropdownMenu.RadioItem>
              );
            })}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
