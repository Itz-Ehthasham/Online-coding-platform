import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Play, Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  assembleArenaProgram,
  problemUsesFunctionHarness,
} from "@/data/staticArenaProblems";

const API = "http://localhost:5555";

const LANGS = [
  { id: "java", label: "Java" },
  { id: "python", label: "Python" },
  { id: "javascript", label: "JavaScript" },
];

/** Fallback skeleton when a DB problem has no `setups` / `starters`. */
const DEFAULT_SETUP = {
  java: `public class Main {
    public static void main(String[] args) {
        // TODO: read stdin if needed, print answer
    }
}
`,
  python: `# Read from stdin, print answer

`,
  javascript: `// e.g. const fs = require("fs");
// const input = fs.readFileSync(0, "utf8");
// print answer with console.log(...)

`,
};

function resolveSetup(problem, language) {
  return (
    problem?.setups?.[language] ??
    problem?.starters?.[language] ??
    DEFAULT_SETUP[language] ??
    ""
  );
}

function ArenaCodeEditor({ problem }) {
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  const applySetup = useCallback(() => {
    setCode(resolveSetup(problem, language));
  }, [problem, language]);

  useEffect(() => {
    applySetup();
  }, [applySetup, problem?.id, language]);

  const usesHarness = problemUsesFunctionHarness(problem);
  const runnableCode = assembleArenaProgram(problem, language, code);
  const runInput =
    usesHarness && problem.testCases?.length
      ? (problem.testCases[0].input ?? "")
      : "";

  const handleCompile = async () => {
    setRunning(true);
    setOutput("");
    try {
      const response = await axios.post(
        `${API}/compile`,
        { code: runnableCode, input: runInput, language },
        { params: { lang: language } }
      );
      const { output: out, compileTime, executionTime, memoryUsage } =
        response.data;
      const mem =
        memoryUsage != null && !Number.isNaN(Number(memoryUsage))
          ? `${Number(memoryUsage).toFixed(2)} MB`
          : "N/A";
      setOutput(
        `Output:\n${out}\n\nCompile / run: ${compileTime} ms | Exec: ${executionTime} ms | Mem: ${mem}`
      );
    } catch (error) {
      const msg =
        error.response?.data?.error ??
        error.message ??
        "Unknown error";
      setOutput(`Error:\n${msg}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="flex h-full min-h-[480px] flex-col border-l border-white/[0.06] text-white">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-white/[0.08] bg-white/[0.03] px-3 py-2">
        <div className="relative">
          <label className="sr-only" htmlFor="arena-lang">
            Language
          </label>
          <select
            id="arena-lang"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={cn(
              "h-9 cursor-pointer appearance-none rounded-lg border border-white/[0.12] bg-white/[0.05] py-1.5 pl-3 pr-8 text-sm text-white/90",
              "outline-none focus:ring-1 focus:ring-indigo-400/40"
            )}
          >
            {LANGS.map((l) => (
              <option key={l.id} value={l.id} className="bg-zinc-900">
                {l.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        </div>
        <button
          type="button"
          onClick={applySetup}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:bg-white/5"
        >
          Reset setup
        </button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={handleCompile}
          disabled={running}
          className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/40 bg-sky-600/20 px-3 py-1.5 text-sm font-medium text-sky-100 disabled:opacity-50"
        >
          {running ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          Run
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
        <p className="text-xs text-white/45">
          {usesHarness ? (
            <>
              <strong className="text-white/65">LeetCode-style:</strong> edit the{" "}
              <strong className="text-white/65">function / Solution</strong> below.
              <strong className="text-white/65"> Run</strong> uses sample stdin (first case) and shows your stdout.
            </>
          ) : (
            <>
              Full program mode: your code reads stdin.{" "}
              <strong>Run</strong> uses empty stdin unless your problem states otherwise.
            </>
          )}
        </p>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="min-h-[240px] w-full flex-1 resize-y rounded-xl border border-white/[0.1] bg-[#0a0a0a] p-3 font-mono text-sm text-white/90 outline-none focus:ring-1 focus:ring-indigo-500/40"
          placeholder={
            usesHarness
              ? "Implement solve / Solution here"
              : "Write your full program here"
          }
        />

        {output ? (
          <pre className="whitespace-pre-wrap rounded-xl border border-white/[0.08] bg-black/40 p-3 font-mono text-xs text-white/75">
            {output}
          </pre>
        ) : null}
      </div>
    </div>
  );
}

export default ArenaCodeEditor;
