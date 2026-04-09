import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ChevronLeft, Plus, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATIC_ARENA_PROBLEMS } from "@/data/staticArenaProblems";

const API = "http://localhost:5555";

function difficultyClass(d) {
  const x = String(d || "").toLowerCase();
  if (x.includes("easy"))
    return "border-emerald-500/30 bg-emerald-500/15 text-emerald-200/90";
  if (x.includes("medium") || x.includes("med"))
    return "border-amber-500/30 bg-amber-500/15 text-amber-200/90";
  if (x.includes("hard"))
    return "border-rose-500/30 bg-rose-500/15 text-rose-200/90";
  return "border-white/15 bg-white/[0.06] text-white/70";
}

const Arena = () => {
  const [apiProblems, setApiProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`${API}/problemList/`);
        setApiProblems(response.data.data ?? []);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };
    fetchProblems();
  }, []);

  const sortedProblems = useMemo(() => {
    const list = [...STATIC_ARENA_PROBLEMS, ...apiProblems];
    return [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [apiProblems]);

  return (
    <div className="relative min-h-screen w-full bg-[#030303] text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/[0.06] via-transparent to-rose-500/[0.06] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#030303] to-transparent"
        aria-hidden
      />

      <header className="relative z-10 border-b border-white/[0.08] bg-white/[0.03] px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1.5 text-sm text-white/70 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
            >
              <ChevronLeft className="h-4 w-4 shrink-0 opacity-70" />
              Home
            </Link>
            <div className="hidden h-6 w-px bg-white/10 sm:block" />
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.05] text-amber-300/90">
                <Trophy className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h1 className="text-lg font-semibold tracking-wide sm:text-xl">
                  Arena
                </h1>
                <p className="text-xs text-white/45 sm:text-sm">
                  Built-ins: LeetCode-style functions · DB: full program · Java, Python, JS
                </p>
              </div>
            </div>
          </div>
          <Link
            to="/addproblem"
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-lg border border-indigo-400/35 bg-indigo-500/20 px-4 py-2.5 text-sm font-semibold text-indigo-100 transition",
              "hover:border-indigo-300/50 hover:bg-indigo-500/30 hover:text-white"
            )}
          >
            <Plus className="h-4 w-4" />
            Add problem
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-white/[0.03] shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.1] bg-white/[0.05]">
                  <th className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wider text-white/55 sm:px-6">
                    Order
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wider text-white/55 sm:px-6">
                    Title
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wider text-white/55 sm:px-6">
                    Difficulty
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wider text-white/55 sm:px-6">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {sortedProblems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-12 text-center text-white/45 sm:px-6"
                    >
                      No problems. Add one or check your API connection.
                    </td>
                  </tr>
                ) : (
                  sortedProblems.map((problem) => (
                    <tr
                      key={problem.id}
                      className="transition hover:bg-white/[0.04]"
                    >
                      <td className="whitespace-nowrap px-4 py-4 text-white/70 sm:px-6">
                        {problem.order}
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <Link
                          to={`/workspace/${problem.id}`}
                          className="font-medium text-indigo-300/95 transition hover:text-white"
                        >
                          {problem.title}
                        </Link>
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <span
                          className={cn(
                            "inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium",
                            difficultyClass(problem.difficulty)
                          )}
                        >
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-white/60 sm:px-6">
                        {problem.isStatic ? (
                          <span>
                            {problem.category}
                            <span className="ml-2 rounded border border-indigo-400/25 bg-indigo-500/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-indigo-200/90">
                              Built-in
                            </span>
                          </span>
                        ) : (
                          problem.category
                        )}
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

export default Arena;
