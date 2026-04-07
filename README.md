 # Online Coding Platform

An interactive online coding platform built with the MERN stack (MongoDB, Express, React, Node.js) featuring real-time Java code compilation and execution.

## 🚀 Features

- **Java Code Compiler**: Real-time Java code compilation and execution
- **Interactive Code Editor**: Syntax highlighting and user-friendly interface
- **Problem Solving Arena**: Practice coding problems
- **Contest Battleground**: Competitive programming contests
- **Real-time Output**: See compilation results, execution time, and memory usage

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (optional - platform works without database for compilation)
- **Compiler**: Java Development Kit (JDK)

## 📋 Prerequisites

Make sure you have the following installed on your machine:

- **[Node.js](https://nodejs.org/)** (v16 or higher)
- **npm** (comes with Node.js)
- **[Java Development Kit (JDK)](https://www.oracle.com/java/technologies/downloads/)** (for Java compilation)
- **MongoDB** (optional - required for problem/contest features)

## 🚀 Quick Start

### 1. Clone the repository
```bash
cd Online-coding-platform
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

### 3. Run the application

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
│   │   ├── CompileRoute.js    # Java compilation logic
│   │   ├── SubmitRoute.js     # Code submission handling
│   │   └── ...
│   ├── config.js              # Configuration file
│   └── server.js              # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CodeEditor.jsx     # Java code editor
│   │   │   └── ...
│   │   └── pages/
│   └── ...
└── README.md
```


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
