import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Calendar, ChevronLeft, Moon, Sun, Swords } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStaticBattlegroundContest } from "@/data/staticBattlegroundContests";
import { getStaticArenaProblem } from "@/data/staticArenaProblems";

const API = "http://localhost:5555";
const THEME_STORAGE_KEY = "playground-ui-theme";

function difficultyClass(d, isDark) {
  const x = String(d || "").toLowerCase();
  if (isDark) {
    if (x.includes("easy"))
      return "border-emerald-500/30 bg-emerald-500/15 text-emerald-200/90";
    if (x.includes("medium") || x.includes("med"))
      return "border-amber-500/30 bg-amber-500/15 text-amber-200/90";
    if (x.includes("hard"))
      return "border-rose-500/30 bg-rose-500/15 text-rose-200/90";
    return "border-white/15 bg-white/[0.06] text-white/70";
  }
  if (x.includes("easy"))
    return "border-emerald-600/30 bg-emerald-500/10 text-emerald-800";
  if (x.includes("medium") || x.includes("med"))
    return "border-amber-600/30 bg-amber-500/10 text-amber-900";
  if (x.includes("hard"))
    return "border-rose-600/30 bg-rose-500/10 text-rose-900";
  return "border-zinc-300 bg-zinc-100 text-zinc-700";
}

function contestStatus(startTime, endTime, isDark) {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (now < start) {
    return {
      label: "Upcoming",
      className: isDark
        ? "border-amber-500/35 bg-amber-500/15 text-amber-200/90"
        : "border-amber-500/40 bg-amber-500/10 text-amber-900",
    };
  }
  if (now > end) {
    return {
      label: "Ended",
      className: isDark
        ? "border-white/15 bg-white/[0.06] text-white/55"
        : "border-zinc-300 bg-zinc-200/60 text-zinc-600",
    };
  }
  return {
    label: "Ongoing",
    className: isDark
      ? "border-emerald-500/35 bg-emerald-500/15 text-emerald-200/90"
      : "border-emerald-600/35 bg-emerald-500/10 text-emerald-900",
  };
}

const Contest = () => {
  const { name } = useParams();
  const [contest, setContest] = useState(null);
  const [problemsDetails, setProblemsDetails] = useState([]);
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
    const staticContest = getStaticBattlegroundContest(name);
    if (staticContest) {
      setContest({
        name: staticContest.name,
        description: staticContest.description,
        startTime: staticContest.startTime,
        endTime: staticContest.endTime,
        problems: staticContest.problems,
      });
      const details = staticContest.problems
        .map((p) => getStaticArenaProblem(p.id))
        .filter(Boolean);
      setProblemsDetails(details);
      return;
    }

    const fetchContest = async () => {
      try {
        const response = await axios.get(`${API}/battleground/${name}`);
        const data = response.data.data;
        setContest(data);

        const ids = data.problems.map((problem) => problem.id);

        const fetchProblemsDetails = async () => {
          try {
            const detailsPromises = ids.map((problemId) =>
              axios.get(`${API}/problem/${problemId}`)
            );
            const results = await Promise.all(detailsPromises);
            setProblemsDetails(results.map((result) => result.data.data));
          } catch (error) {
            console.error("Error fetching problem details:", error);
          }
        };

        fetchProblemsDetails();
      } catch (error) {
        console.error("Error fetching contest details:", error);
      }
    };

    fetchContest();
  }, [name]);

  if (!contest) {
    return (
      <div
        className={cn(
          "flex min-h-screen items-center justify-center px-4 transition-colors duration-200",
          isDark ? "bg-[#030303] text-white" : "bg-zinc-100 text-zinc-900"
        )}
        data-theme={uiTheme}
      >
        <p className={isDark ? "text-white/55" : "text-zinc-600"}>
          Loading contest…
        </p>
      </div>
    );
  }

  const status = contestStatus(contest.startTime, contest.endTime, isDark);

  return (
    <div
      className={cn(
        "relative min-h-screen w-full transition-colors duration-200",
        isDark ? "bg-[#030303] text-white" : "bg-zinc-100 text-zinc-900"
      )}
      data-theme={uiTheme}
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
          "relative z-10 border-b px-4 py-4 backdrop-blur-md sm:px-6",
          isDark
            ? "border-white/[0.08] bg-white/[0.03]"
            : "border-zinc-200/80 bg-white/70"
        )}
      >
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/battleground"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition",
                isDark
                  ? "border-white/[0.12] bg-white/[0.04] text-white/70 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                  : "border-zinc-200 bg-white text-zinc-600 shadow-sm hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              <ChevronLeft className="h-4 w-4 shrink-0 opacity-70" />
              Battleground
            </Link>
            <div
              className={cn(
                "hidden h-6 w-px sm:block",
                isDark ? "bg-white/10" : "bg-zinc-200"
              )}
            />
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg border text-rose-300/90",
                  isDark
                    ? "border-white/[0.1] bg-white/[0.05]"
                    : "border-zinc-200 bg-white text-rose-600 shadow-sm"
                )}
              >
                <Swords className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h1
                  className={cn(
                    "text-lg font-semibold tracking-wide sm:text-xl",
                    isDark ? "text-white" : "text-zinc-900"
                  )}
                >
                  Contest
                </h1>
                <p
                  className={cn(
                    "text-xs sm:text-sm",
                    isDark ? "text-white/45" : "text-zinc-500"
                  )}
                >
                  {contest.name}
                </p>
              </div>
            </div>
          </div>
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
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <h2
            className={cn(
              "mb-3 text-2xl font-semibold tracking-tight sm:text-3xl",
              isDark ? "text-white" : "text-zinc-900"
            )}
          >
            {contest.name}
          </h2>
          {contest.description ? (
            <p
              className={cn(
                "mb-4 max-w-3xl text-base leading-relaxed",
                isDark ? "text-white/60" : "text-zinc-600"
              )}
            >
              {contest.description}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={cn(
                "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
                status.className
              )}
            >
              {status.label}
            </span>
            <div
              className={cn(
                "flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm",
                isDark ? "text-white/50" : "text-zinc-600"
              )}
            >
              <span className="inline-flex items-center gap-1.5">
                <Calendar
                  className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    isDark ? "text-white/35" : "text-zinc-400"
                  )}
                  aria-hidden
                />
                <span className={isDark ? "text-white/55" : "text-zinc-700"}>
                  Start:
                </span>{" "}
                {new Date(contest.startTime).toLocaleString()}
              </span>
              <span>
                <span className={isDark ? "text-white/55" : "text-zinc-700"}>
                  End:
                </span>{" "}
                {new Date(contest.endTime).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <h3
          className={cn(
            "mb-4 text-lg font-semibold sm:text-xl",
            isDark ? "text-white/90" : "text-zinc-900"
          )}
        >
          Problems
        </h3>
        <div
          className={cn(
            "overflow-hidden rounded-2xl border shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] backdrop-blur-sm",
            isDark
              ? "border-white/[0.1] bg-white/[0.03]"
              : "border-zinc-200 bg-white shadow-sm"
          )}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr
                  className={cn(
                    "border-b",
                    isDark
                      ? "border-white/[0.1] bg-white/[0.05]"
                      : "border-zinc-200 bg-zinc-50"
                  )}
                >
                  <th
                    className={cn(
                      "whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wider sm:px-6",
                      isDark ? "text-white/55" : "text-zinc-500"
                    )}
                  >
                    Title
                  </th>
                  <th
                    className={cn(
                      "whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wider sm:px-6",
                      isDark ? "text-white/55" : "text-zinc-500"
                    )}
                  >
                    Difficulty
                  </th>
                </tr>
              </thead>
              <tbody
                className={cn(
                  "divide-y",
                  isDark ? "divide-white/[0.06]" : "divide-zinc-200"
                )}
              >
                {problemsDetails.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      className={cn(
                        "px-4 py-12 text-center sm:px-6",
                        isDark ? "text-white/45" : "text-zinc-500"
                      )}
                    >
                      No problems in this contest yet.
                    </td>
                  </tr>
                ) : (
                  problemsDetails.map((problem) => (
                    <tr
                      key={problem.id}
                      className={cn(
                        "transition",
                        isDark ? "hover:bg-white/[0.04]" : "hover:bg-zinc-50"
                      )}
                    >
                      <td className="px-4 py-4 sm:px-6">
                        <Link
                          to={`/workspace/${problem.id}`}
                          className={cn(
                            "font-medium transition",
                            isDark
                              ? "text-indigo-300/95 hover:text-white"
                              : "text-indigo-700 hover:text-indigo-900"
                          )}
                        >
                          {problem.title}
                        </Link>
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <span
                          className={cn(
                            "inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium",
                            difficultyClass(problem.difficulty, isDark)
                          )}
                        >
                          {problem.difficulty}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contest;
