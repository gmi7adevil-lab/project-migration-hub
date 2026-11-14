import { cn } from "@/lib/utils";
import type { FlagId } from "@/lib/i18n/languages";

/**
 * Small inline flags (emoji flags don't render on Windows).
 * Flag colours are part of the image itself, not theme colours.
 */
export function LanguageFlag({ flag, className }: { flag: FlagId; className?: string }) {
  return (
    <svg viewBox="0 0 24 16" aria-hidden="true" className={cn("lang-flag h-4 w-6 shrink-0", className)}>
      {flag === "fr" && (
        <>
          <rect width="8" height="16" fill="#0055A4" />
          <rect x="8" width="8" height="16" fill="#FFFFFF" />
          <rect x="16" width="8" height="16" fill="#EF4135" />
        </>
      )}
      {flag === "ma" && (
        <>
          <rect width="24" height="16" fill="#C1272D" />
          {/* Interlaced pentagram (seal of Solomon) drawn as a single outline */}
          <polygon
            points="12,3.6 14.47,11.2 8.01,6.5 15.99,6.5 9.53,11.2"
            fill="none"
            stroke="#006233"
            strokeWidth="0.9"
            strokeLinejoin="miter"
          />
        </>
      )}
      {flag === "amazigh" && (
        <>
          <rect width="24" height="5.34" fill="#0087CE" />
          <rect y="5.33" width="24" height="5.34" fill="#3EA33F" />
          <rect y="10.66" width="24" height="5.34" fill="#FEE100" />
          {/* Yaz (ⵣ), the Amazigh emblem */}
          <g fill="none" stroke="#D21034" strokeWidth="1.3" strokeLinecap="round">
            <path d="M12 2.4V13.6" />
            <path d="M8.6 2.6C9.2 5.6 14.8 5.6 15.4 2.6" />
            <path d="M8.6 13.4C9.2 10.4 14.8 10.4 15.4 13.4" />
          </g>
        </>
      )}
    </svg>
  );
}
