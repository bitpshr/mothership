"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Building2, Loader2, Search, Users, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchAll, type SearchResult } from "@/actions/search";
import { cn } from "@/lib/utils";

const TYPE_META = {
  property: { icon: Building2, label: "Properties" },
  tenant: { icon: Users, label: "Tenants" },
  maintenance: { icon: Wrench, label: "Requests" },
} as const;

const GROUP_ORDER = ["property", "tenant", "maintenance"] as const;

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    setActiveIndex(-1);
    if (value.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setOpen(true);
    startTransition(async () => {
      const res = await searchAll(value);
      setResults(res);
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      navigate(results[activeIndex]);
    }
  }

  function navigate(result: SearchResult) {
    router.push(result.href);
    setOpen(false);
    setQuery("");
    setResults([]);
    inputRef.current?.blur();
  }

  const grouped = results.reduce<Partial<Record<SearchResult["type"], SearchResult[]>>>(
    (acc, r) => ({ ...acc, [r.type]: [...(acc[r.type] ?? []), r] }),
    {},
  );

  const showDropdown = open && query.trim().length >= 2;
  const hasResults = results.length > 0;

  return (
    <div ref={containerRef} className="relative w-56 md:w-72 lg:w-80">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search…"
          className="h-9 bg-secondary border-border pl-8 pr-14 text-sm focus:border-input focus:bg-background"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground opacity-70 sm:flex">
          ⌘K
        </kbd>
      </div>

      {showDropdown && (
        <div className="absolute top-full z-50 mt-1.5 w-full overflow-hidden rounded-lg border bg-popover shadow-xl">
          {isPending && !hasResults ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : hasResults ? (
            <div className="py-1.5">
              {GROUP_ORDER.map((type) => {
                const items = grouped[type];
                if (!items?.length) return null;
                const { icon: Icon, label } = TYPE_META[type];
                return (
                  <div key={type}>
                    <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {label}
                    </p>
                    {items.map((result) => {
                      const idx = results.indexOf(result);
                      return (
                        <button
                          key={result.id}
                          onClick={() => navigate(result)}
                          className={cn(
                            "flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors",
                            idx === activeIndex ? "bg-primary/10 text-primary" : "hover:bg-muted/60",
                          )}
                        >
                          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
                            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium leading-tight">{result.title}</p>
                            <p className="truncate text-xs text-muted-foreground">{result.subtitle}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  );
}
