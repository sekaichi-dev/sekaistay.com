"use client";

/* 検索付きセレクト（宿泊者名簿フォーム用・依存なしの軽量コンボボックス）
 * label に加え keywords（別言語名・別名）でも部分一致検索できる。
 */

import { useEffect, useMemo, useRef, useState } from "react";

export interface SearchOption {
  value: string;
  label: string;
  keywords?: string;
}

interface Props {
  id?: string;
  value: string;
  options: SearchOption[];
  placeholder: string;
  searchPlaceholder: string;
  noResultsText: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SearchSelect({
  id, value, options, placeholder, searchPlaceholder, noResultsText, onChange, className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) || null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => `${o.label} ${o.keywords || ""}`.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open]);

  function select(option: SearchOption) {
    onChange(option.value);
    setOpen(false);
    setQuery("");
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) select(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className || ""}`}>
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        value={open ? query : selected?.label || ""}
        placeholder={selected && !open ? selected.label : open ? searchPlaceholder : placeholder}
        onFocus={() => { setOpen(true); setQuery(""); }}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onKeyDown={onKeyDown}
        autoComplete="off"
        className="w-full rounded-switch-md border border-switch-stone-border bg-white px-3.5 py-2.5 pr-9 text-[15px] text-ink placeholder:text-switch-stone-text-disabled focus:outline-none focus:border-sekai-teal focus:ring-2 focus:ring-sekai-teal/20 transition-colors"
      />
      <svg
        width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"
        className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-switch-stone-03 transition-transform ${open ? "rotate-180" : ""}`}
      >
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {open && (
        <ul
          role="listbox"
          className="absolute z-30 mt-1 w-full max-h-56 overflow-auto rounded-switch-md border border-switch-stone-border bg-white shadow-switch-modal py-1"
        >
          {filtered.length === 0 && (
            <li className="px-3.5 py-2.5 text-[13px] text-ink/45">{noResultsText}</li>
          )}
          {filtered.map((o, i) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              onMouseDown={(e) => { e.preventDefault(); select(o); }}
              onMouseEnter={() => setActiveIndex(i)}
              className={`px-3.5 py-2.5 text-[14px] cursor-pointer ${
                i === activeIndex ? "bg-teal-tint text-deep-teal" : "text-ink"
              } ${o.value === value ? "font-semibold" : ""}`}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
