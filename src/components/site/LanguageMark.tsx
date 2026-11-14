import { cn } from "@/lib/utils";
import type { LangMark } from "@/lib/i18n/languages";

/**
 * Small inline language identities (emoji flags don't render on Windows).
 * Flag colours are part of the artwork itself, not theme colours.
 */
export function LanguageMark({ mark, className }: { mark: LangMark; className?: string }) {
  if (mark === "arabic" || mark === "tifinagh") {
    return (
      <span aria-hidden="true" className={cn("lang-glyph", mark === "tifinagh" && "is-tifinagh", className)}>
        {mark === "arabic" ? "ع" : "ⵣ"}
      </span>
    );
  }
  return (
    <svg viewBox="0 0 24 16" aria-hidden="true" className={cn("lang-flag h-3.5 w-5 shrink-0 rounded-[3px]", className)}>
      {mark === "fr" && (
        <>
          <rect width="8" height="16" fill="#0055A4" />
          <rect x="8" width="8" height="16" fill="#FFFFFF" />
          <rect x="16" width="8" height="16" fill="#EF4135" />
        </>
      )}
      {mark === "ma" && (
        <>
          <rect width="24" height="16" fill="#C1272D" />
          <polygon
            points="12,3.6 14.47,11.2 8.01,6.5 15.99,6.5 9.53,11.2"
            fill="none"
            stroke="#006233"
            strokeWidth="0.9"
            strokeLinejoin="miter"
          />
        </>
      )}
    </svg>
  );
}

/** Miniature browser window used as the language selector's logo. */
export function BrowserGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 13" aria-hidden="true" className={cn("h-[11px] w-[13px] shrink-0", className)}>
      <rect x="0.6" y="0.6" width="14.8" height="11.8" rx="2.4" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M0.8 4.1H15.2" stroke="currentColor" strokeWidth="1" opacity="0.7" />
      <circle cx="2.9" cy="2.35" r="0.7" fill="currentColor" />
      <circle cx="5" cy="2.35" r="0.7" fill="currentColor" opacity="0.7" />
      <circle cx="7.1" cy="2.35" r="0.7" fill="currentColor" opacity="0.45" />
      <path d="M4.2 8.3H11.8M8 5.9C9 7 9 9.6 8 10.7M8 5.9C7 7 7 9.6 8 10.7" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.8" strokeLinecap="round" />
    </svg>
  );
}
