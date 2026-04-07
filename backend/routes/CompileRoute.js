import express from "express";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import url from "url";

const router = express.Router();

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_TMP = path.join(path.dirname(__dirname), "tmp");

const EXEC_OPTS = { maxBuffer: 10 * 1024 * 1024 };

function hrtimeMs(start) {
  const [s, ns] = process.hrtime(start);
  return (s * 1000 + ns / 1e6).toFixed(2);
}

function makeWorkDir() {
  const id = `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  const workDir = path.join(BACKEND_TMP, id);
  fs.mkdirSync(workDir, { recursive: true });
  return workDir;
}

function cleanupWorkDir(workDir) {
  try {
    fs.rmSync(workDir, { recursive: true, force: true });
  } catch (e) {
    console.error("Cleanup failed:", e);
  }
}

function pythonCommand() {
  if (process.env.PYTHON_PATH) return process.env.PYTHON_PATH;
  return process.platform === "win32" ? "python" : "python3";
}

router.post("/", (req, res) => {
  const code = req.body.code;
  const input = req.body.input ?? "";
  /* Support lang via body or query (belt-and-suspenders if body field is stripped). */
  const language = String(
    req.body.language ||
      req.body.lang ||
      req.query?.lang ||
      req.query?.language ||
      "java"
  ).toLowerCase();

  if (code === undefined || code === null) {
    return res.status(400).json({ error: "Missing code" });
  }

  const allowed = ["java", "python", "javascript"];
  if (!allowed.includes(language)) {
    return res.status(400).json({
      error: `Unsupported language "${language}". Use: ${allowed.join(", ")}`,
    });
  }

  let workDir;
  try {
    workDir = makeWorkDir();
  } catch {
    return res.status(500).json({ error: "Failed to create work directory" });
  }

  const inputPath = path.join(workDir, "stdin.txt");
  try {
    fs.writeFileSync(inputPath, input);
  } catch {
    cleanupWorkDir(workDir);
    return res.status(500).json({ error: "Failed to write stdin file" });
  }

  const runShell = (command, cwd, startRunHrtime, compileTime) => {
    exec(
      command,
      { cwd, shell: true, ...EXEC_OPTS },
      (runError, runStdout, runStderr) => {
        const executionTime = hrtimeMs(startRunHrtime);
        const out = (runStdout || "").toString();
        const errOut = (runStderr || "").toString();

        if (runError) {
          cleanupWorkDir(workDir);
          return res.status(400).json({
            error: errOut || out || String(runError.message || runError),
            compileTime,
            executionTime,
          });
        }

        cleanupWorkDir(workDir);
        return res.json({
          output: out,
          compileTime,
          executionTime,
          memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
        });
      }
    );
  };

  if (language === "java") {
    const javaPath = path.join(workDir, "Main.java");
    try {
      fs.writeFileSync(javaPath, code);
    } catch {
      cleanupWorkDir(workDir);
      return res.status(500).json({ error: "Failed to write Java source" });
    }

    const startCompile = process.hrtime();
    exec(
      `javac Main.java`,
      { cwd: workDir, shell: true, ...EXEC_OPTS },
      (jErr, _jOut, jStderr) => {
        const compileTime = hrtimeMs(startCompile);
        if (jErr) {
          cleanupWorkDir(workDir);
          return res.status(400).json({
            error: (jStderr || "").toString() || String(jErr.message || jErr),
            compileTime,
          });
        }

        const startRun = process.hrtime();
        runShell(`java Main < stdin.txt`, workDir, startRun, compileTime);
      }
    );
    return;
  }

  if (language === "python") {
    const pyPath = path.join(workDir, "main.py");
    try {
      fs.writeFileSync(pyPath, code);
    } catch {
      cleanupWorkDir(workDir);
      return res.status(500).json({ error: "Failed to write Python source" });
    }

    const compileTime = "0.00";
    const startRun = process.hrtime();
    const py = pythonCommand();
    runShell(`${py} main.py < stdin.txt`, workDir, startRun, compileTime);
    return;
  }

  if (language === "javascript") {
    const jsPath = path.join(workDir, "main.js");
    try {
      fs.writeFileSync(jsPath, code);
    } catch {
      cleanupWorkDir(workDir);
      return res.status(500).json({ error: "Failed to write JavaScript source" });
    }

    const compileTime = "0.00";
    const startRun = process.hrtime();
    runShell(`node main.js < stdin.txt`, workDir, startRun, compileTime);
  }
});

export default router;
