import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Calendar, ChevronLeft, ChevronRight, Swords } from "lucide-react";
import { cn } from "@/lib/utils";

const API = "http://localhost:5555";

function contestStatus(startTime, endTime) {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (now < start) return { label: "Upcoming", className: "border-amber-500/35 bg-amber-500/15 text-amber-200/90" };
  if (now > end) return { label: "Ended", className: "border-white/15 bg-white/[0.06] text-white/55" };
  return { label: "Ongoing", className: "border-emerald-500/35 bg-emerald-500/15 text-emerald-200/90" };
}

const BattleGround = () => {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get(`${API}/battleground`);
        setContests(response.data.data);
      } catch (error) {
        console.error("Error fetching contests:", error);
      }
    };
    fetchContests();
  }, []);

  const sortedContests = [...contests].sort(
    (a, b) => new Date(a.startTime) - new Date(b.startTime)
  );

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
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1.5 text-sm text-white/70 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
          >
            <ChevronLeft className="h-4 w-4 shrink-0 opacity-70" />
            Home
          </Link>
          <div className="hidden h-6 w-px bg-white/10 sm:block" />
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.05] text-rose-300/90">
              <Swords className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h1 className="text-lg font-semibold tracking-wide sm:text-xl">
                Battleground
              </h1>
              <p className="text-xs text-white/45 sm:text-sm">
                Contests &amp; timed rounds
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <h2 className="mb-2 text-center text-xs font-medium uppercase tracking-[0.2em] text-white/40">
          Available
        </h2>
        <p className="mb-8 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          Contests
        </p>

        {sortedContests.length === 0 ? (
          <p className="rounded-2xl border border-white/[0.1] bg-white/[0.03] px-6 py-12 text-center text-white/45 backdrop-blur-sm">
            No contests loaded. Check your API or add contests in the database.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sortedContests.map((contest) => {
              const status = contestStatus(contest.startTime, contest.endTime);
              return (
                <li key={contest._id}>
                  <Link
                    to={`/contest/${contest.name}`}
                    className={cn(
                      "group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.12] bg-white/[0.03] p-5 text-left shadow-[0_8px_32px_0_rgba(0,0,0,0.35)] backdrop-blur-sm transition",
                      "hover:border-white/[0.18] hover:bg-white/[0.05] hover:shadow-[0_12px_40px_0_rgba(99,102,241,0.12)]",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400/60"
                    )}
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-indigo-200/95">
                        {contest.name}
                      </h3>
                      <ChevronRight className="h-5 w-5 shrink-0 text-white/35 transition group-hover:translate-x-0.5 group-hover:text-white/60" />
                    </div>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-white/50">
                      {contest.description}
                    </p>
                    <span
                      className={cn(
                        "mb-3 inline-flex w-fit rounded-full border px-2.5 py-0.5 text-xs font-medium",
                        status.className
                      )}
                    >
                      {status.label}
                    </span>
                    <div className="space-y-2 border-t border-white/[0.08] pt-4 text-xs text-white/45">
                      <p className="flex items-start gap-2">
                        <Calendar className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/35" />
                        <span>
                          <span className="text-white/55">Start: </span>
                          {new Date(contest.startTime).toLocaleString()}
                        </span>
                      </p>
                      <p>
                        <span className="text-white/55">End: </span>
                        {new Date(contest.endTime).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
};

export default BattleGround;
