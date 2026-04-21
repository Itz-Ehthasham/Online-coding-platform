 # Online Coding Platform

An interactive online coding platform built with the MERN stack (MongoDB, Express, React, Node.js) featuring real-time code compilation and execution. Users can practice coding problems, compete in contests, and write code with a Monaco-based editor.

## 🚀 Features

- **Real-time Code Compilation**: Execute Java and Python code instantly
- **Interactive Code Editor**: Monaco Editor with syntax highlighting
- **Problem Solving Arena**: Browse and solve coding problems
- **Contest Battleground**: Participate in competitive programming contests
- **Test Case Execution**: Run test cases against submitted code
- **Split View Layout**: Code editor and output viewer side-by-side
- **Dark/Light Theme Support**: Customizable UI themes
- **Responsive Design**: Mobile-friendly interface with TailwindCSS

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, React Router, Monaco Editor, Chakra UI
- **Backend**: Node.js, Express.js, Mongoose (MongoDB ODM)
- **Database**: MongoDB (optional - platform works without it for compilation)
- **Compiler Support**: Java Development Kit (JDK), Python
- **Code Execution**: Child process execution with timeout/memory limits

## 📋 Prerequisites

Make sure you have the following installed on your machine:

- **[Node.js](https://nodejs.org/)** (v16 or higher)
- **npm** (comes with Node.js)
- **[Java Development Kit (JDK)](https://www.oracle.com/java/technologies/downloads/)** (for Java compilation)
- **Python** (optional - for Python code execution)
- **MongoDB** (optional - required only for problem/contest persistence)

## 🚀 Quick Start

### 1. Clone the repository
```bash
cd "Online coding platform"
```

### 2. Install dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd ../backend
npm install
```

### 3. Configure Environment Variables

**Backend (.env file in backend directory):**
```
PORT=5000
MONGODB_URL=mongodb://localhost:27017/coding-platform
NODE_ENV=development
PYTHON_PATH=python3
```

### 4. Run the application

**Start the backend server:**
```bash
cd backend
node server.js
```
The backend will start on port 5555.

**Start the frontend development server:**
```bash
cd frontend
npm run dev
```
The frontend will start on port 5173.

### 4. Access the application

Open your browser and navigate to `http://localhost:5173`

## 📝 Usage

### Java Code Compilation

The platform supports Java code compilation and execution. Here's a sample program to test:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

**Note**: The Java compiler expects the class name to be `Main` as the backend compiles the code as `Main.java`.

## 🔧 Configuration

### Backend Configuration

The backend server runs on port 5555 by default. You can modify this in `backend/config.js`.

### Database Setup (Optional)

For full functionality including problems and contests:

1. Set up MongoDB (local or MongoDB Atlas)
2. Update the MongoDB connection string in `backend/config.js`
3. Restart the backend server

**Note**: The code compilation features work perfectly without database connection.

## 🐛 Troubleshooting

### Common Issues

1. **Java compilation fails**: Ensure JDK is properly installed and `javac` command is available in PATH
2. **Database errors**: The platform works without MongoDB - only problem/contest features require database
3. **Port conflicts**: Ensure ports 5555 and 5173 are available

### Server Status

- **Backend**: `http://localhost:5555` - Handles compilation and API requests
- **Frontend**: `http://localhost:5173` - User interface

## 📁 Project Structure

```
Online-coding-platform/
├── backend/
│   ├── routes/
│   │   ├── CompileRoute.js       # Real-time Java compilation API
│   │   ├── SubmitRoute.js        # Code submission with test case grading
│   │   ├── ProblemListRoute.js   # Fetch all problems
│   │   ├── ProblemRoute.js       # Fetch specific problem details
│   │   ├── ContestRoute.js       # Contest/battleground operations
│   │   └── Main.java             # Helper Java compilation class
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Problem.js            # Problem schema
│   │   ├── Contest.js            # Contest schema
│   │   ├── Submission.js         # Submission tracking schema
│   │   └── ProblemList.js        # Problem list collection
│   ├── lib/
│   │   └── submitRunner.js       # Code execution engine for test case grading
│   ├── config.js                 # Configuration (PORT, DB URL)
│   ├── server.js                 # Express app setup & route initialization
│   └── package.json              # Node dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Playground.jsx    # Free code editor (no database needed)
│   │   │   ├── Arena.jsx         # Problem solving arena
│   │   │   └── BattleGround.jsx  # Contest competitions
│   │   ├── components/
│   │   │   ├── CodeEditor.jsx    # Monaco editor wrapper
│   │   │   ├── Workspace.jsx     # Problem workspace with editor & description
│   │   │   ├── Contest.jsx       # Contest UI
│   │   │   ├── ProblemsTable.jsx # Problems list display
│   │   │   ├── Topbar.jsx        # Navigation bar
│   │   │   └── AddProblem.jsx    # Admin: add new problems
│   │   ├── constants.js          # API endpoints, static data
│   │   ├── theme.js              # Theme configuration
│   │   ├── App.jsx               # Route definitions
│   │   └── main.jsx              # React entry point
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # TailwindCSS customization
│   └── package.json              # React dependencies
└── README.md
```

---

## 🏗️ Architecture Overview

### Backend Architecture

The backend is built with **Express.js** and follows a modular route-based architecture:

#### Core Components:

1. **Server (server.js)**
   - Initializes Express application
   - Sets up middleware (CORS, JSON parsing)
   - Registers API routes
   - Attempts MongoDB connection (optional - app works without it)
   - Listens on configured PORT (default: 5555)

2. **Routes (API Endpoints)**
   - `/compile` - Real-time Java/Python compilation
   - `/submit` - Code submission with test case execution
   - `/problem` - Individual problem details
   - `/problemList` - All available problems
   - `/battleground` - Contest operations

3. **Code Execution Engine (lib/submitRunner.js)**
   - Creates isolated working directories with timestamps
   - Handles Java and Python compilation/execution
   - Runs code against multiple test cases
   - Measures execution time and memory usage
   - Automatically cleans up temporary files
   - Prevents code injection with sandboxed execution

4. **Database Models (models/)**
   - **User.js** - User authentication and profile
   - **Problem.js** - Problem definitions, test cases, constraints
   - **Contest.js** - Contest metadata and rules
   - **Submission.js** - User code submissions with results
   - **ProblemList.js** - Problem collection for quick access

#### How Backend Compilation Works:

```
User submits code → API receives request at /compile or /submit
    ↓
Backend creates temp directory with unique ID
    ↓
Writes code to file (Main.java or solution.py)
    ↓
Executes compiler (javac, python)
    ↓
If compilation succeeds, executes with test cases
    ↓
Captures output, execution time, memory usage
    ↓
Returns results to frontend (stdout, stderr, execution time)
    ↓
Cleans up temporary files
```

---

### Frontend Architecture

The frontend is built with **React 18** and **Vite**, with routing and component-based UI design:

#### Core Pages:

1. **Home (pages/Home.jsx)**
   - Landing page with platform overview
   - Navigation to different features

2. **Playground (pages/Playground.jsx)**
   - Free-form code editor (no authentication needed)
   - Compiles code directly without database
   - Theme switcher (dark/light mode)
   - Real-time compilation feedback
   - Ideal for quick code testing

3. **Arena (pages/Arena.jsx)**
   - Browse all coding problems
   - Filter and search problems
   - Displays problem table with difficulty levels
   - Click to open problem in workspace

4. **BattleGround (pages/BattleGround.jsx)**
   - View available contests
   - Join and participate in contests
   - Time-based competitive programming

5. **Workspace (components/Workspace.jsx)**
   - **Left side**: Problem description, examples, constraints
   - **Right side**: Code editor with live compilation
   - Run tests against problem's test cases
   - Submit solution for grading

#### Key Components:

1. **CodeEditor (components/CodeEditor.jsx)**
   - Monaco Editor integration
   - Syntax highlighting for Java/Python
   - Customizable themes and font sizes
   - Line numbers and bracket matching

2. **ProblemsTable (components/ProblemsTable.jsx)**
   - Displays problems in tabular format
   - Shows difficulty, acceptance rate
   - Clickable rows link to workspace

3. **AddProblem (components/AddProblem.jsx)**
   - Admin interface to create new problems
   - Input test cases and expected outputs
   - Set problem constraints

#### Frontend Data Flow:

```
User writes code in editor
    ↓
Clicks "Run" or "Submit" button
    ↓
Frontend sends code + test cases to /compile or /submit API
    ↓
Display loading state
    ↓
Backend processes and returns results
    ↓
Display output, execution time, test results
    ↓
Show pass/fail for each test case
```

---

## 🔌 API Endpoints Reference

### Compilation & Execution

**POST `/compile`**
- Compiles and runs code in real-time
- Request body:
  ```json
  {
    "code": "public class Main { ... }",
    "language": "java",
    "testCases": ["input1", "input2"]
  }
  ```
- Response: `{ results: { output, execution_time, memory } }`

**POST `/submit`**
- Submits code for grading against all test cases
- Request body: Same as `/compile`
- Response: `{ results: [ { testCase, passed, output } ] }`

### Problem Management

**GET `/problemList`**
- Fetches all problems from database
- Response: Array of problem objects

**GET `/problem/:id`**
- Fetches specific problem with test cases
- Response: Problem object with description, constraints, test cases

### Contests

**GET `/battleground`**
- Fetches all available contests
- Response: Array of contest objects

**POST `/battleground`**
- Create new contest
- Request body: Contest details

---

## 🔄 Request/Response Flow Example

### Example: Run Java Code in Playground

```
1. Frontend (Playground.jsx):
   - User writes: "System.out.println("Hello");"
   - Clicks "Run"
   - Sends POST to http://localhost:5555/compile
   
2. Backend (CompileRoute.js):
   - Creates temp dir: /tmp/1704067200000_abc123xyz/
   - Writes file: Main.java with provided code
   - Executes: javac Main.java
   - Executes: java Main
   
3. Backend Response:
   {
     "results": {
       "output": "Hello\n",
       "executionTime": "125.45",
       "error": null,
       "memory": "32MB"
     }
   }
   
4. Frontend:
   - Receives response
   - Displays output in right panel: "Hello"
   - Shows execution time: 125.45ms
```

---

## 🛡️ Security Considerations

1. **Code Sandboxing**
   - Code runs in isolated processes, not in main thread
   - Temporary files in unique directories prevent conflicts

2. **Timeout Protection**
   - Infinite loops are caught with execution timeouts
   - Memory limits prevent resource exhaustion

3. **Cleanup**
   - Automatic deletion of temporary files after execution
   - Prevents disk space buildup

4. **Input Validation**
   - Backend validates code and test cases
   - Returns user-friendly error messages

---

## 📊 Database Schema (Optional)

When MongoDB is connected, these collections are used:

```javascript
// User
{
  _id: ObjectId,
  username: String,
  email: String,
  submissions: [ObjectId]  // References to Submission docs
}

// Problem
{
  _id: ObjectId,
  title: String,
  description: String,
  difficulty: "Easy" | "Medium" | "Hard",
  testCases: [
    { input: String, output: String },
    ...
  ]
}

// Submission
{
  _id: ObjectId,
  userId: ObjectId,
  problemId: ObjectId,
  code: String,
  language: String,
  results: [ { testCase, passed, output } ],
  submittedAt: Date
}
```

---

## 🚀 Performance Tips

1. **Code Execution**: Keep test cases reasonable in size to avoid timeout
2. **Frontend**: Vite provides fast HMR during development
3. **Backend**: Node.js handles concurrent requests efficiently
4. **Database**: Add indexes on frequently queried fields (username, problem title)

---

## 📄 License

ISC License - Feel free to modify and use as needed!


## 🎯 Current Status

✅ **Working Features:**
- Java code compilation and execution
- Real-time output display
- Compilation time and memory usage tracking
- Interactive code editor with syntax highlighting

⚠️ **Requires Database:**
- Problem list and solving
- Contest functionality
- User submissions tracking

Enjoy coding with Java on our platform! 🚀
