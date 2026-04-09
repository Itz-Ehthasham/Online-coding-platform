import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Code2, Moon, Sun } from "lucide-react";
import CodeEditor from "../components/CodeEditor";
import { cn } from "@/lib/utils";

const THEME_STORAGE_KEY = "playground-ui-theme";

const Playground = () => {
  const [uiTheme, setUiTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : "dark";
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, uiTheme);
  }, [uiTheme]);

  const isDark = uiTheme === "dark";
  const toggleTheme = () =>
    setUiTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div
      className={cn(
        "relative flex h-screen max-h-[100dvh] flex-col overflow-hidden transition-colors duration-200",
        isDark ? "bg-[#030303] text-white" : "bg-zinc-100 text-zinc-900"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 blur-3xl",
          isDark
            ? "bg-gradient-to-br from-indigo-500/[0.06] via-transparent to-rose-500/[0.06]"
            : "bg-gradient-to-br from-indigo-400/15 via-transparent to-rose-400/15"
        )}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b to-transparent",
          isDark ? "from-[#030303]" : "from-zinc-100"
        )}
        aria-hidden
      />

      <header
        className={cn(
          "relative z-10 flex h-14 shrink-0 items-center justify-between border-b px-4 backdrop-blur-md sm:px-6",
          isDark
            ? "border-white/[0.08] bg-white/[0.03]"
            : "border-zinc-200/80 bg-white/70"
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition",
              isDark
                ? "border-white/[0.12] bg-white/[0.04] text-white/70 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                : "border-zinc-200 bg-white text-zinc-600 shadow-sm hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
            )}
          >
            <ChevronLeft className="h-4 w-4 shrink-0 opacity-70" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <div
            className={cn(
              "hidden h-6 w-px sm:block",
              isDark ? "bg-white/10" : "bg-zinc-200"
            )}
          />
          <div className="flex min-w-0 items-center gap-2">
            <Code2
              className={cn(
                "h-5 w-5 shrink-0",
                isDark ? "text-indigo-300/90" : "text-indigo-600"
              )}
            />
            <div className="min-w-0">
              <h1
                className={cn(
                  "truncate text-sm font-semibold tracking-wide sm:text-base",
                  isDark ? "text-white/95" : "text-zinc-900"
                )}
              >
                Playground
              </h1>
              <p
                className={cn(
                  "hidden text-xs sm:block",
                  isDark ? "text-white/40" : "text-zinc-500"
                )}
              >
                Run Java, Python, or JavaScript on the server
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            title={isDark ? "Light theme" : "Dark theme"}
            className={cn(
              "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition",
              isDark
                ? "border-white/[0.12] bg-white/[0.05] text-amber-200/90 hover:bg-white/[0.09]"
                : "border-zinc-300 bg-white text-amber-600 shadow-sm hover:bg-zinc-50"
            )}
          >
            {isDark ? (
              <Sun className="h-4 w-4" aria-hidden />
            ) : (
              <Moon className="h-4 w-4" aria-hidden />
            )}
          </button>
          {["Java", "Python", "JS"].map((label) => (
            <span
              key={label}
              className={cn(
                "rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider sm:px-2.5 sm:py-1 sm:text-[11px]",
                isDark
                  ? "border-white/[0.1] bg-white/[0.04] text-amber-200/80"
                  : "border-zinc-200 bg-white text-amber-700 shadow-sm"
              )}
            >
              {label}
            </span>
          ))}
        </div>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
        <CodeEditor uiTheme={uiTheme} defaultLanguage="javascript" />
      </main>
    </div>
  );
};

export default Playground;
