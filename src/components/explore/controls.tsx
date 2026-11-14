import { Search, X } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type ChipOption<T extends string> = { value: T; label: string; count?: number };

/** Single-select filter chips shared by the crop and project lists. */
export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: ChipOption<T>[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={cn("ts-chip", active && "is-active")}
          >
            {o.label}
            {o.count !== undefined && <span className="ts-chip-count">{o.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label: string;
}) {
  const { t } = useI18n();
  return (
    <label className="ts-search">
      <Search aria-hidden="true" className="size-4 shrink-0 text-forest/45" />
      <span className="sr-only">{label}</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-forest outline-none placeholder:text-forest/40"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={t.common.clearSearch}
          className="flex size-6 items-center justify-center rounded-full text-forest/50 hover:bg-forest/[0.06] hover:text-forest"
        >
          <X className="size-3.5" />
        </button>
      )}
    </label>
  );
}

/** Callout distinguishing illustrative or general information from verified data. */
export function Notice({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="ts-notice">
      <span aria-hidden="true" className="mt-0.5 shrink-0 text-gold">
        {icon}
      </span>
      <p>{children}</p>
    </div>
  );
}

export function EmptyResults({ onReset }: { onReset: () => void }) {
  const { t } = useI18n();
  return (
    <div className="rounded-2xl border border-dashed border-primary/25 p-6 text-center text-sm text-forest/60">
      {t.common.noResults}{" "}
      <button type="button" onClick={onReset} className="font-semibold text-primary hover:underline">
        {t.common.resetFilters}
      </button>
    </div>
  );
}
