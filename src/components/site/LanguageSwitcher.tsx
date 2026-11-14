import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown } from "lucide-react";

import { LANG_INFO, LANGS, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { LanguageFlag } from "./LanguageFlag";

/** Short labels for the trigger, so the nav keeps its balance. */
const SHORT_NAME = { fr: "Français", ar: "العربية", ary: "الدارجة", zgh: "تامازيغت" } as const;

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
          "lang-trigger group inline-flex h-11 items-center gap-2 rounded-full ps-2.5 pe-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:outline-none",
        )}
      >
        <span className="lang-flag-ring">
          <LanguageFlag flag={current.flag} />
        </span>
        {!compact && <span className="max-w-[6.5rem] truncate">{SHORT_NAME[lang]}</span>}
        <ChevronDown
          aria-hidden="true"
          className={cn("size-3.5 transition-transform duration-300 group-data-[state=open]:rotate-180", light ? "text-forest/50" : "text-ivory/60")}
        />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className="lang-menu z-[70] w-64 rounded-2xl p-1.5"
          aria-label={t.nav.language}
        >
          <DropdownMenu.Label className="px-3 pt-2 pb-1.5 font-mono text-[10px] tracking-[0.25em] text-ivory/45 uppercase">
            {t.nav.language}
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={lang} onValueChange={(v) => setLang(v as typeof lang)}>
            {LANGS.map((code) => {
              const info = LANG_INFO[code];
              return (
                <DropdownMenu.RadioItem key={code} value={code} className="lang-item">
                  <span className="lang-flag-ring">
                    <LanguageFlag flag={info.flag} />
                  </span>
                  <span className="min-w-0 flex-1" dir={info.dir} lang={info.htmlLang}>
                    <span className="block truncate text-sm font-medium">{info.name}</span>
                  </span>
                  <span className="text-[11px] text-ivory/45" dir="ltr">
                    {info.hint}
                  </span>
                  <DropdownMenu.ItemIndicator className="text-accent">
                    <Check className="size-4" />
                  </DropdownMenu.ItemIndicator>
                </DropdownMenu.RadioItem>
              );
            })}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
