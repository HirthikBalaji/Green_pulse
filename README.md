# 🌿 GreenPulse Campus

**GreenPulse** is a premium, gamified sustainability platform designed for college campuses. It encourages eco-friendly behavior through a competitive leaderboard, AI-powered verification, and role-based rewards.

## 🚀 Key Features

-   **🛡️ Secure Authentication**: Strict email domain validation for Students (`@ch.students.amrita.edu`) and Faculty (`@ch.amrita.edu`) with automatic role and department detection.
-   **🤖 AI-Powered Verification**: Reports undergo an AI analysis flow to verify proof of eco-activity before points are awarded.
-   **🏢 Department Battles**: Cross-department leaderboard (ECE, RAI, CSE, etc.) to foster healthy competition.
-   **⚖️ Moderation Queue**: A dedicated "Human-in-the-loop" dashboard for Faculty to review ambiguous AI results.
-   **📊 Live Analytics**: Interactive charts (Chart.js) showing campus-wide impact and sustainability trends.
-   **✨ Premium UI**: Glassmorphic, vibrantly designed responsive interface.

## 🛠️ Tech Stack

-   **Frontend**: Vanilla HTML5, CSS3 (Custom Variables), JavaScript (ES6+), [Chart.js](https://www.chartjs.org/)
-   **Backend**: Node.js, Express.js
-   **Security**: JWT (JSON Web Tokens), Bcrypt for password hashing
-   **Persistence**: LocalStorage (Demo mode) / PostgreSQL-ready Schema

## 📁 Project Structure

```text
Green_pulse/
├── auth.html             # Login/Signup Interface
├── auth.js               # Frontend Auth Logic
├── auth_styles.css       # Premium Auth Styling
├── app.js                # Main Application Logic & Routing
├── index.html            # Core Application Shell
├── style.css             # Global Design System
├── department_map.js     # Amrita Email Parsing Utility
├── server.js             # Node/Express Backend
├── schema.sql            # Production Database Schema
└── package.json          # Backend Dependencies
```

## ⚙️ Quick Start

### 1. Frontend (Demo Mode)
Simply open `index.html` in any modern web browser. The app runs in **Demo Mode** using LocalStorage for persistence.
> [!TIP]
> Use the browser console (F12) and run `resetAllData()` if you need to wipe your session.

### 2. Backend (Production Foundation)
1. Install dependencies: `npm install`
2. Run server: `node server.js`
3. The server provides the API foundation for production-grade user management.

## 🧪 AI Verification Flow
For testing the AI flow as a **Student**:
1. Sign up with a student email.
2. Go to the **Report** page and upload any image for an activity.
3. The "Submit" button will trigger the AI analysis simulation.

## ⚖️ Moderation Flow
For testing as **Faculty**:
1. Sign up with a faculty email.
2. Logged-in Faculty can see the **Moderation Queue**.
3. Manually Approve or Reject reports flagged as "Under Review" by the AI.

---
Built with 💚 for a sustainable campus.
