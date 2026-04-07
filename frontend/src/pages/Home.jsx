import { useNavigate } from "react-router-dom";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { ChevronRight, Swords, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const MODES = [
  {
    title: "Arena",
    description:
      "Browse problems, practice, and submit solutions in a focused workspace.",
    to: "/arena",
    icon: Trophy,
    accent: "from-amber-500/20 to-orange-500/10",
    iconClass: "text-amber-300/90",
  },
  {
    title: "Battleground",
    description:
      "Jump into contests and timed challenges when the heat is on.",
    to: "/battleground",
    icon: Swords,
    accent: "from-rose-500/20 to-fuchsia-500/10",
    iconClass: "text-rose-300/90",
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#030303] text-white">
      <section className="relative min-h-screen w-full">
        <HeroGeometric
          badge="Coding Backwards"
          title1="Code. Compete."
          title2="Level up."
          description="Write, run, and refine your solutions in a focused editor built for curious programmers."
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-[12%] z-20 flex justify-center px-4 sm:bottom-[15%]">
          <button
            type="button"
            onClick={() => navigate("/playground")}
            className="pointer-events-auto relative overflow-hidden rounded-full border border-white/[0.15] bg-white/[0.03] px-10 py-3.5 text-base font-medium tracking-wide shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] backdrop-blur-[2px] transition duration-300 after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.06),transparent_70%)] hover:border-white/[0.22] hover:bg-white/[0.06] hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.14)] active:scale-[0.98] sm:px-12 sm:py-4 sm:text-lg"
          >
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-rose-300">
              Open Editor
            </span>
          </button>
        </div>
        <p
          className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-center text-xs text-white/35"
          aria-hidden
        >
          Scroll for modes
        </p>
      </section>

      <section
        className="relative z-10 border-t border-white/[0.06] px-4 py-16 sm:px-6 sm:py-24"
        aria-label="Arena and Battleground"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#030303] via-indigo-950/20 to-[#030303]" />

        <div className="relative mx-auto max-w-3xl">
          <p className="mb-2 text-center text-xs font-medium uppercase tracking-[0.2em] text-white/40">
            Continue
          </p>
          <h2 className="mb-10 text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Pick a mode
          </h2>

          <div className="flex flex-col gap-5 sm:gap-6">
            {MODES.map(
              ({
                title,
                description,
                to,
                icon: Icon,
                accent,
                iconClass,
              }) => (
                <button
                  key={to}
                  type="button"
                  onClick={() => navigate(to)}
                  className={cn(
                    "group relative w-full overflow-hidden rounded-2xl border border-white/[0.12] bg-white/[0.03] p-6 text-left shadow-[0_8px_32px_0_rgba(0,0,0,0.35)] backdrop-blur-sm transition",
                    "hover:border-white/[0.18] hover:bg-white/[0.05] hover:shadow-[0_12px_40px_0_rgba(99,102,241,0.12)]",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400/60",
                    "active:scale-[0.99]"
                  )}
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br opacity-60 blur-2xl transition group-hover:opacity-90",
                      accent
                    )}
                  />
                  <div className="relative flex items-start gap-4">
                    <span
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.05]",
                        iconClass
                      )}
                    >
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg font-semibold text-white sm:text-xl">
                          {title}
                        </h3>
                        <ChevronRight className="h-5 w-5 shrink-0 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-white/70" />
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-white/50 sm:text-base">
                        {description}
                      </p>
                    </div>
                  </div>
                </button>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
