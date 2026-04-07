import { useState, useCallback, useRef, useLayoutEffect, useEffect } from "react";
import Editor from "@monaco-editor/react";
import Split from "react-split";
import axios from "axios";
import { Play, Loader2, Terminal, FileInput, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE = "http://localhost:5555";

const LANGUAGES = [
  { id: "java", label: "Java", monaco: "java", tabSize: 4 },
  { id: "python", label: "Python", monaco: "python", tabSize: 4 },
  { id: "javascript", label: "JavaScript", monaco: "javascript", tabSize: 2 },
];

/** Editor / console vertical split (%). After Run, console gets at least half the workspace. */
const SPLIT_INITIAL = [68, 32];
const SPLIT_AFTER_RUN = [50, 50];

const DEFAULT_TEMPLATES = {
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Playground");
    }
}
`,
  python: `print("Hello, Playground")
`,
  javascript: `console.log("Hello, Playground");
`,
};

function CodeEditor({ uiTheme = "dark" }) {
  const isDark = uiTheme === "dark";
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState(DEFAULT_TEMPLATES.java);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [consoleTab, setConsoleTab] = useState("input");
  const [running, setRunning] = useState(false);
  const [splitSizes, setSplitSizes] = useState(SPLIT_INITIAL);
  const [editorHeight, setEditorHeight] = useState(320);
  const editorHostRef = useRef(null);
  const consolePreRef = useRef(null);
  const monacoEditorRef = useRef(null);
  const monacoRef = useRef(null);

  const langConfig =
    LANGUAGES.find((l) => l.id === language) ?? LANGUAGES[0];

  const handleMonacoMount = useCallback((editor, monaco) => {
    monacoEditorRef.current = editor;
    monacoRef.current = monaco;
    editor.layout();
  }, []);

  useEffect(() => {
    const monaco = monacoRef.current;
    if (!monaco?.editor) return;
    monaco.editor.setTheme(
      isDark ? "coding-backwards-dark" : "coding-backwards-light"
    );
  }, [isDark]);

  useEffect(() => {
    monacoEditorRef.current?.layout();
  }, [editorHeight]);

  useLayoutEffect(() => {
    const el = editorHostRef.current;
    if (!el) return undefined;
    const apply = () => {
      const h = el.getBoundingClientRect().height;
      if (h > 0) setEditorHeight(Math.max(Math.floor(h), 120));
    };
    apply();
    const ro = new ResizeObserver(() => apply());
    ro.observe(el);
    window.addEventListener("resize", apply);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);

  useEffect(() => {
    if (!output || consoleTab !== "output") return;
    const scrollConsole = () => {
      const el = consolePreRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    };
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(scrollConsole);
    });
    return () => cancelAnimationFrame(id);
  }, [output, consoleTab]);

  const handleEditorBeforeMount = useCallback((monaco) => {
    monaco.editor.defineTheme("coding-backwards-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0a0a0a",
        "editor.lineHighlightBackground": "#ffffff08",
        "editorLineNumber.foreground": "#6b7280",
        "editorLineNumber.activeForeground": "#9ca3af",
        "editorCursor.foreground": "#a5b4fc",
        "editor.selectionBackground": "#6366f140",
      },
    });
    monaco.editor.defineTheme("coding-backwards-light", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#fafafa",
        "editor.lineHighlightBackground": "#f4f4f5",
        "editorLineNumber.foreground": "#a1a1aa",
        "editorLineNumber.activeForeground": "#52525b",
        "editorCursor.foreground": "#4f46e5",
        "editor.selectionBackground": "#6366f140",
      },
    });
  }, []);

  const handleLanguageChange = (nextId) => {
    setLanguage(nextId);
    setCode(DEFAULT_TEMPLATES[nextId] ?? DEFAULT_TEMPLATES.java);
  };

  const handleCompile = async () => {
    setRunning(true);
    setConsoleTab("output");
    try {
      const response = await axios.post(
        `${API_BASE}/compile`,
        { code, input, language },
        { params: { lang: language } }
      );

      const { output: out, compileTime, executionTime, memoryUsage } =
        response.data;

      const mem =
        memoryUsage != null && !Number.isNaN(Number(memoryUsage))
          ? `${Number(memoryUsage).toFixed(2)} MB`
          : "N/A";

      const compileLabel =
        language === "java" ? "Compile time" : "Compile / prep";

      const formattedOutput = `Output:
${out}

${compileLabel}: ${compileTime} ms
Execution time: ${executionTime} ms
Memory usage: ${mem}`;

      setOutput(formattedOutput);
    } catch (error) {
      const msg =
        error.response?.data?.error ??
        error.message ??
        "Unknown error occurred";
      setOutput(`Error:
${msg}

Compile time: N/A
Execution time: N/A
Memory usage: N/A`);
    } finally {
      setRunning(false);
      setSplitSizes([...SPLIT_AFTER_RUN]);
    }
  };

  return (
    <div
      data-theme={uiTheme}
      className={cn(
        "flex h-full min-h-0 flex-1 flex-col overflow-hidden transition-colors duration-200",
        isDark ? "bg-[#030303]/80" : "bg-zinc-100/90"
      )}
    >
      <div
        className={cn(
          "flex shrink-0 flex-wrap items-center gap-2 border-b px-3 py-2 sm:gap-3 sm:px-4",
          isDark
            ? "border-white/[0.08] bg-white/[0.02]"
            : "border-zinc-200/90 bg-white/60"
        )}
      >
        <div className="relative">
          <label className="sr-only" htmlFor="playground-language">
            Language
          </label>
          <select
            id="playground-language"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className={cn(
              "h-9 cursor-pointer appearance-none rounded-lg border py-1.5 pl-3 pr-9 text-sm font-medium outline-none transition focus:ring-1",
              isDark
                ? "border-white/[0.12] bg-white/[0.05] text-white/90 hover:border-white/20 hover:bg-white/[0.08] focus:border-indigo-400/50 focus:ring-indigo-400/30"
                : "border-zinc-300 bg-white text-zinc-800 shadow-sm hover:border-zinc-400 hover:bg-zinc-50 focus:border-indigo-500 focus:ring-indigo-500/25"
            )}
          >
            {LANGUAGES.map((l) => (
              <option
                key={l.id}
                value={l.id}
                className={isDark ? "bg-[#1a1a1a]" : "bg-white"}
              >
                {l.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className={cn(
              "pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2",
              isDark ? "text-white/40" : "text-zinc-500"
            )}
          />
        </div>
        <span
          className={cn(
            "hidden text-xs sm:inline",
            isDark ? "text-white/40" : "text-zinc-500"
          )}
        >
          Editor
        </span>
        <div className="flex-1" />
        <button
          type="button"
          onClick={handleCompile}
          disabled={running}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-600/25 px-4 py-2 text-sm font-semibold text-emerald-100 shadow-[0_0_0_1px_rgba(16,185,129,0.15)] transition",
            "hover:border-emerald-400/50 hover:bg-emerald-500/35 hover:text-white",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
        >
          {running ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4 fill-current" />
          )}
          Run
        </button>
      </div>

      <Split
        className="split-vertical flex-1 min-h-0 overflow-hidden"
        direction="vertical"
        sizes={splitSizes}
        minSize={[160, 120]}
        gutterSize={6}
        gutterAlign="center"
        snapOffset={24}
      >
        <div
          ref={editorHostRef}
          className={cn(
            "flex h-full min-h-0 w-full flex-col overflow-hidden border-b",
            isDark
              ? "border-white/[0.06] bg-[#0a0a0a]"
              : "border-zinc-200/80 bg-[#fafafa]"
          )}
        >
          <Editor
            key={language}
            height={editorHeight}
            language={langConfig.monaco}
            theme={
              isDark ? "coding-backwards-dark" : "coding-backwards-light"
            }
            value={code}
            onChange={(v) => setCode(v ?? "")}
            beforeMount={handleEditorBeforeMount}
            onMount={handleMonacoMount}
            loading={
              <div
                className={cn(
                  "flex h-full items-center justify-center text-sm",
                  isDark
                    ? "bg-[#0a0a0a] text-white/40"
                    : "bg-[#fafafa] text-zinc-400"
                )}
              >
                Loading editor…
              </div>
            }
            options={{
              minimap: { enabled: true, scale: 0.85 },
              fontSize: 14,
              fontLigatures: true,
              lineNumbers: "on",
              scrollBeyondLastLine: true,
              wordWrap: "on",
              tabSize: langConfig.tabSize,
              padding: { top: 12, bottom: 12 },
              renderLineHighlight: "line",
              cursorBlinking: "smooth",
              smoothScrolling: true,
              bracketPairColorization: { enabled: true },
              automaticLayout: true,
            }}
          />
        </div>

        <div
          className={cn(
            "flex h-full min-h-0 flex-col overflow-hidden",
            isDark ? "bg-[#080808]" : "bg-white"
          )}
        >
          <div
            className={cn(
              "flex shrink-0 items-center gap-1 border-b px-2",
              isDark ? "border-white/[0.08]" : "border-zinc-200"
            )}
          >
            <TabButton
              active={consoleTab === "input"}
              onClick={() => setConsoleTab("input")}
              icon={<FileInput className="h-3.5 w-3.5" />}
              label="Input"
              isDark={isDark}
            />
            <TabButton
              active={consoleTab === "output"}
              onClick={() => setConsoleTab("output")}
              icon={<Terminal className="h-3.5 w-3.5" />}
              label="Console"
              isDark={isDark}
            />
          </div>

          {consoleTab === "input" ? (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="stdin (optional)"
              spellCheck={false}
              className={cn(
                "min-h-0 flex-1 resize-none overflow-y-auto bg-transparent px-3 py-3 font-mono text-sm leading-relaxed outline-none focus:ring-0",
                isDark
                  ? "text-white/85 placeholder:text-white/25"
                  : "text-zinc-800 placeholder:text-zinc-400"
              )}
            />
          ) : (
            <pre
              ref={consolePreRef}
              className={cn(
                "min-h-0 flex-1 overflow-x-auto overflow-y-auto overscroll-y-contain whitespace-pre-wrap break-words px-3 py-3 font-mono text-xs leading-relaxed sm:text-sm",
                isDark ? "text-white/75" : "text-zinc-700"
              )}
            >
              {output || (
                <span className={isDark ? "text-white/35" : "text-zinc-400"}>
                  Run your code to see output, timings, and memory here.
                </span>
              )}
            </pre>
          )}
        </div>
      </Split>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, isDark = true }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-t-md border border-b-0 px-3 py-2 text-xs font-medium transition sm:text-sm",
        isDark
          ? active
            ? "border-white/[0.12] bg-white/[0.06] text-white"
            : "border-transparent text-white/45 hover:bg-white/[0.04] hover:text-white/70"
          : active
            ? "border-zinc-200 bg-zinc-100 text-zinc-900"
            : "border-transparent text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

export default CodeEditor;
