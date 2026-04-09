import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, Moon, Sun } from "lucide-react";
import Split from "react-split";
import { cn } from "@/lib/utils";
import CodeEditor from "./CodeEditor";
import { getStaticArenaProblem } from "@/data/staticArenaProblems";

const API = "http://localhost:5555";
const THEME_STORAGE_KEY = "playground-ui-theme";

const Workspace = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loadError, setLoadError] = useState(null);
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

  useEffect(() => {
    const local = getStaticArenaProblem(id);
    if (local) {
      setProblem(local);
      setLoadError(null);
      return;
    }

    setProblem(null);
    setLoadError(null);

    const fetchProblem = async () => {
      try {
        const response = await axios.get(`${API}/problem/${id}`);
        setProblem(response.data.data);
      } catch (error) {
        console.error("Error fetching problem:", error);
        setLoadError(
          error.response?.data?.message ||
            "Could not load this problem from the server."
        );
        setProblem(null);
      }
    };

    fetchProblem();
  }, [id]);

  if (!problem) {
    return (
      <div
        className={cn(
          "flex min-h-screen flex-col items-center justify-center gap-6 px-4 transition-colors duration-200",
          isDark ? "bg-[#030303] text-white" : "bg-zinc-100 text-zinc-900"
        )}
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/arena"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition",
              isDark
                ? "border-white/[0.12] bg-white/[0.04] text-white/70 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                : "border-zinc-200 bg-white text-zinc-600 shadow-sm hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
            )}
          >
            <ChevronLeft className="h-4 w-4 shrink-0 opacity-70" />
            Back to Arena
          </Link>
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
        </div>
        <p
          className={cn(
            "text-center",
            isDark ? "text-white/60" : "text-zinc-600"
          )}
        >
          {loadError ?? "Loading…"}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-screen min-h-0 transition-colors duration-200",
        isDark ? "bg-[#030303] text-white" : "bg-zinc-100 text-zinc-900"
      )}
      data-theme={uiTheme}
    >
      <Split
        className="workspace-split split h-full min-h-0"
        sizes={[50, 50]}
        minSize={200}
        expandToMin={false}
      >
        <div
          className={cn(
            "min-h-0 overflow-y-auto border-r p-4 sm:p-6",
            isDark
              ? "border-white/[0.08] bg-[#030303]"
              : "border-zinc-200/90 bg-zinc-100"
          )}
        >
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Link
              to="/arena"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition",
                isDark
                  ? "border-white/[0.12] bg-white/[0.04] text-white/70 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                  : "border-zinc-200 bg-white text-zinc-600 shadow-sm hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              <ChevronLeft className="h-4 w-4 shrink-0 opacity-70" />
              Back to Arena
            </Link>
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
          </div>
          <h1
            className={cn(
              "mb-4 text-2xl font-semibold sm:text-3xl",
              isDark ? "text-white" : "text-zinc-900"
            )}
          >
            {problem.title}
          </h1>
          <p
            className={cn(
              "mb-6 whitespace-pre-line text-base leading-relaxed",
              isDark ? "text-white/65" : "text-zinc-600"
            )}
          >
            {problem.description}
          </p>
          {problem.isStatic && problem.testCases?.[0] ? (
            <div
              className={cn(
                "mb-6 rounded-xl border",
                isDark
                  ? "border-white/[0.1] bg-white/[0.03]"
                  : "border-zinc-200 bg-white shadow-sm"
              )}
            >
              <h2
                className={cn(
                  "border-b px-3 py-2 text-sm font-semibold",
                  isDark
                    ? "border-white/[0.08] text-white/85"
                    : "border-zinc-200 text-zinc-800"
                )}
              >
                Expected output (sample)
              </h2>
              <pre
                className={cn(
                  "whitespace-pre-wrap break-words p-3 font-mono text-sm",
                  isDark ? "text-indigo-200/95" : "text-indigo-700"
                )}
              >
                {problem.testCases[0].output}
              </pre>
            </div>
          ) : (
            <div className="mb-6">
              <h2
                className={cn(
                  "mb-3 text-lg font-semibold",
                  isDark ? "text-white/90" : "text-zinc-900"
                )}
              >
                Sample test cases
              </h2>
              {problem.testCases.map((testCase, index) => (
                <div
                  key={testCase._id || index}
                  className={cn(
                    "mb-4 rounded-xl border",
                    isDark
                      ? "border-white/[0.1] bg-white/[0.03]"
                      : "border-zinc-200 bg-white shadow-sm"
                  )}
                >
                  <h3
                    className={cn(
                      "border-b px-3 py-2 text-sm font-medium",
                      isDark
                        ? "border-white/[0.08] text-white/80"
                        : "border-zinc-200 text-zinc-800"
                    )}
                  >
                    Test case {index + 1}
                  </h3>
                  <pre
                    className={cn(
                      "whitespace-pre-wrap break-words p-3 font-mono text-xs sm:text-sm",
                      isDark ? "text-white/70" : "text-zinc-700"
                    )}
                  >
                    <span
                      className={
                        isDark ? "text-emerald-300/90" : "text-emerald-700"
                      }
                    >
                      Input:
                    </span>{" "}
                    {JSON.stringify(testCase.input)}
                  </pre>
                  <pre
                    className={cn(
                      "whitespace-pre-wrap break-words border-t p-3 font-mono text-xs sm:text-sm",
                      isDark
                        ? "border-white/[0.06] text-white/70"
                        : "border-zinc-200 text-zinc-700"
                    )}
                  >
                    <span
                      className={
                        isDark ? "text-indigo-300/90" : "text-indigo-700"
                      }
                    >
                      Expected:
                    </span>{" "}
                    {JSON.stringify(testCase.output)}
                  </pre>
                </div>
              ))}
            </div>
          )}
          <p className={isDark ? "text-white/55" : "text-zinc-600"}>
            <strong className={isDark ? "text-white/75" : "text-zinc-800"}>
              Difficulty:
            </strong>{" "}
            {problem.difficulty}
          </p>
        </div>
        <div
          className={cn(
            "min-h-0 min-w-0 overflow-hidden",
            isDark ? "bg-[#0a0a0a]" : "bg-white"
          )}
        >
          <CodeEditor
            key={problem.id}
            uiTheme={uiTheme}
            problem={problem}
            defaultLanguage="javascript"
          />
        </div>
      </Split>
    </div>
  );
};

export default Workspace;
