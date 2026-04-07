/**
 * Built-in Arena problems use a LeetCode-style contract:
 * - Java: `class Solution { ... }` with methods shown in each setup
 * - Python: top-level `def solve(...):`
 * - JavaScript: top-level `function solve(...) { ... }`
 *
 * `harnesses` wraps {{USER_CODE}} with a small driver that reads stdin (same as test cases) and prints the result.
 * Database problems omit `harnesses` — those stay stdin / full-program style.
 */

const H_SUM_JAVA = `import java.util.Scanner;

{{USER_CODE}}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        Solution sol = new Solution();
        System.out.println(sol.solve(a, b));
    }
}
`;

const H_SUM_PY = `{{USER_CODE}}

import sys
_a, _b = map(int, sys.stdin.read().split())
print(solve(_a, _b))
`;

const H_SUM_JS = `{{USER_CODE}}
const fs = require("fs");
const _nums = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);
console.log(solve(_nums[0], _nums[1]));
`;

const H_MAX_JAVA = H_SUM_JAVA;
const H_MAX_PY = H_SUM_PY;
const H_MAX_JS = H_SUM_JS;

const H_HELLO_JAVA = `{{USER_CODE}}

public class Main {
    public static void main(String[] args) {
        new Solution().solve();
    }
}
`;

const H_HELLO_PY = `{{USER_CODE}}

solve()
`;

const H_HELLO_JS = `{{USER_CODE}}
solve();
`;

export const STATIC_ARENA_PROBLEMS = [
  {
    isStatic: true,
    id: "static-sum-two",
    order: 1,
    title: "Sum of two numbers",
    category: "Basics",
    difficulty: "Easy",
    description:
      "Implement **Solution** (Java) or **`solve(a, b)`** (Python/JS).\n\nReturn the sum of two integers. Hidden tests pass stdin like `4 7` and expect stdout `11` (LeetCode-style driver).",
    testCases: [
      { _id: "s1", input: "2 3\n", output: "5" },
      { _id: "s2", input: "10 20\n", output: "30" },
      { _id: "s3", input: "-5 12\n", output: "7" },
    ],
    harnesses: {
      java: H_SUM_JAVA,
      python: H_SUM_PY,
      javascript: H_SUM_JS,
    },
    setups: {
      java: `class Solution {
    public int solve(int a, int b) {
        // TODO: return a + b
        return 0;
    }
}
`,
      python: `def solve(a, b):
    # TODO: return a + b
    pass
`,
      javascript: `function solve(a, b) {
    // TODO: return a + b
}
`,
    },
  },
  {
    isStatic: true,
    id: "static-max-two",
    order: 2,
    title: "Maximum of two",
    category: "Basics",
    difficulty: "Easy",
    description:
      "Implement **Solution.solve(a,b)** (Java) or **`solve(a, b)`** (Python/JS).\n\nReturn the larger integer (either if equal). Stdin is two integers.",
    testCases: [
      { _id: "m1", input: "3 9\n", output: "9" },
      { _id: "m2", input: "42 10\n", output: "42" },
      { _id: "m3", input: "7 7\n", output: "7" },
    ],
    harnesses: {
      java: H_MAX_JAVA,
      python: H_MAX_PY,
      javascript: H_MAX_JS,
    },
    setups: {
      java: `class Solution {
    public int solve(int a, int b) {
        // TODO: return the larger of a and b
        return 0;
    }
}
`,
      python: `def solve(a, b):
    # TODO: return max(a, b)
    pass
`,
      javascript: `function solve(a, b) {
    // TODO: return Math.max(a, b)
}
`,
    },
  },
  {
    isStatic: true,
    id: "static-hello-arena",
    order: 3,
    title: "Hello Arena",
    category: "Warmup",
    difficulty: "Easy",
    description:
      "Implement **Solution.solve()** (Java) or **`solve()`** (Python/JS) with **no parameters**.\n\nPrint exactly one line: `Hello Arena`",
    testCases: [{ _id: "h1", input: "", output: "Hello Arena" }],
    harnesses: {
      java: H_HELLO_JAVA,
      python: H_HELLO_PY,
      javascript: H_HELLO_JS,
    },
    setups: {
      java: `class Solution {
    void solve() {
        // TODO: print exactly: Hello Arena
    }
}
`,
      python: `def solve():
    # TODO: print exactly: Hello Arena
    pass
`,
      javascript: `function solve() {
    // TODO: print exactly: Hello Arena
}
`,
    },
  },
];

/** Built-in (and any) problem that uses function + harness wrapping. */
export function problemUsesFunctionHarness(problem) {
  if (!problem?.harnesses) return false;
  return ["java", "python", "javascript"].some((l) => Boolean(problem.harnesses[l]));
}

/** Insert user submission into harness; if no harness, return user code as-is (DB / stdin problems). */
export function assembleArenaProgram(problem, language, userCode) {
  const lang = language === "js" ? "javascript" : language;
  const tpl = problem?.harnesses?.[lang];
  if (!tpl || !userCode) return userCode ?? "";
  return tpl.split("{{USER_CODE}}").join(userCode);
}

export function getStaticArenaProblem(id) {
  return STATIC_ARENA_PROBLEMS.find((p) => p.id === id) ?? null;
}
