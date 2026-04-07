import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import Split from "react-split";
import ArenaCodeEditor from "./ArenaCodeEditor";
import { getStaticArenaProblem } from "@/data/staticArenaProblems";

const API = "http://localhost:5555";

const Workspace = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loadError, setLoadError] = useState(null);

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
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#030303] px-4 text-white">
        <Link
          to="/arena"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1.5 text-sm text-white/70 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
        >
          <ChevronLeft className="h-4 w-4 shrink-0 opacity-70" />
          Back to Arena
        </Link>
        <p className="text-center text-white/60">
          {loadError ?? "Loading…"}
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen min-h-0 bg-[#030303] text-white">
      <Split
        className="workspace-split split h-full min-h-0"
        sizes={[50, 50]}
        minSize={200}
        expandToMin={false}
      >
        <div className="min-h-0 overflow-y-auto border-r border-white/[0.08] bg-[#030303] p-4 sm:p-6">
          <Link
            to="/arena"
            className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1.5 text-sm text-white/70 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
          >
            <ChevronLeft className="h-4 w-4 shrink-0 opacity-70" />
            Back to Arena
          </Link>
          <h1 className="mb-4 text-2xl font-semibold text-white sm:text-3xl">
            {problem.title}
          </h1>
          <p className="mb-6 whitespace-pre-line text-base leading-relaxed text-white/65">
            {problem.description}
          </p>
          {problem.isStatic && problem.testCases?.[0] ? (
            <div className="mb-6 rounded-xl border border-white/[0.1] bg-white/[0.03]">
              <h2 className="border-b border-white/[0.08] px-3 py-2 text-sm font-semibold text-white/85">
                Expected output (sample)
              </h2>
              <pre className="whitespace-pre-wrap break-words p-3 font-mono text-sm text-indigo-200/95">
                {problem.testCases[0].output}
              </pre>
            </div>
          ) : (
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-semibold text-white/90">
                Sample test cases
              </h2>
              {problem.testCases.map((testCase, index) => (
                <div
                  key={testCase._id || index}
                  className="mb-4 rounded-xl border border-white/[0.1] bg-white/[0.03]"
                >
                  <h3 className="border-b border-white/[0.08] px-3 py-2 text-sm font-medium text-white/80">
                    Test case {index + 1}
                  </h3>
                  <pre className="whitespace-pre-wrap break-words p-3 font-mono text-xs text-white/70 sm:text-sm">
                    <span className="text-emerald-300/90">Input:</span>{" "}
                    {JSON.stringify(testCase.input)}
                  </pre>
                  <pre className="whitespace-pre-wrap break-words border-t border-white/[0.06] p-3 font-mono text-xs text-white/70 sm:text-sm">
                    <span className="text-indigo-300/90">Expected:</span>{" "}
                    {JSON.stringify(testCase.output)}
                  </pre>
                </div>
              ))}
            </div>
          )}
          <p className="text-white/55">
            <strong className="text-white/75">Difficulty:</strong>{" "}
            {problem.difficulty}
          </p>
        </div>
        <div className="min-h-0 min-w-0 overflow-hidden bg-[#0a0a0a]">
          <ArenaCodeEditor problem={problem} />
        </div>
      </Split>
    </div>
  );
};

export default Workspace;
