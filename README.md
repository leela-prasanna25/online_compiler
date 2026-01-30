 Online Compiler – Coding Judge System##

**📌 Project Overview**

This project is an Online Compiler that allows users to write, compile, and execute code in multiple programming languages.
It features a Spring Boot backend, a responsive frontend UI, and PostgreSQL database integration, along with Judge0 API for real-time code execution.
The platform enables users to practice coding problems, run code instantly, and track submissions efficiently.

**🚀 Features**
```
🧑‍💻 Write and run code online
⚡ Supports multiple programming languages
📦 Problem management system
📊 Submission tracking
🔒 REST API-based backend
🌐 Interactive frontend UI
🔁 Real-time code execution using Judge0 API
🗄️ PostgreSQL database integration
```

**🛠️ Tech Stack**
```
🔹 Backend
Java
Spring Boot
Maven
REST APIs
JPA 
PostgreSQL

🔹 Frontend
HTML
CSS
JavaScript
Node Modules

🔹Database
PostgreSQL

🔹 Code Execution API
Judge0 API

```
**📂 Project Structure**

```
codingtest/
│
├── Backend/ → Spring Boot backend
│
│ └── src/main/java/com/demo/codingtest
│     ├── config/ → Configuration Classes
│     ├── controller/ → REST Controllers
│     ├── dto/ → Data Transfer Objects
│     ├── model/ → Entity Classes
│     ├── repository/ → Database Layer
│     └── service/ → Business Logic
│
├── Frontend/ → React User Interface
│
│ ├── public/ → Static Assets
│
│ ├── src/
│ │ ├── components/ → Reusable UI Components
│ │ │ └── Navbar.jsx
│ │ ├── pages/ → Application Pages
│ │ ├── services/ → API Service Calls
│ │ ├── App.jsx → Main App Component
│ │ ├── main.jsx → Entry Point
│ │ └── index.css → Global Styles
│
│ ├── index.html → Root HTML File
│ ├── package.json → Project Dependencies
│ ├── package-lock.json
│ └── vite.config.js → Vite Configuration
```



**⚙️ Installation & Setup**
```
🔹 Backend Setup
-Navigate to backend folder
        cd Backend
-Build project
        mvn clean install
-Run Spring Boot app
       mvn spring-boot:run
-Backend runs on:
      http://localhost:8080

🔹 Frontend Setup
-Open the Frontend folder
-Install dependencies:
    npm install
-Run the frontend:
    npm start
```
**🔗 API Endpoints**
```

📘 Problems

GET /problems → Get all problems
POST /problems → Add a problem

📗 Submissions

POST /submit → Submit code
GET /submissions → View submissions

```

**📸 How It Works**
```

User writes code
Code is sent to backend
Backend calls Judge0 API
Judge0 executes code
Result is returned to frontend
```

**🔮 Future Enhancements**
```

User authentication
Code editor themes
Contest mode
Leaderboard
Test case validation
```
**🤝 Contribution**

Contributions are welcome! Feel free to fork this repo and submit pull requests.

**📄 License**

This project is for educational purposes.

**👩‍💻 Author**

Leela Prasanna Mutyala
